# Data API Specification

This is the main API interface to be used for CRUD on module's data.

It allows Fluidspace environment to handle errors along with displaying appropriate UI status to the user. It parses JSON responses and performs basic validation to ensure your module can interact on data with minimum code.

## 🔖 Docs Index
* [What is Fluidspace?](https://gist.github.com/rishiktiwari/645f48422aad7ca7781d1142b3f3b1bd)
* [Installation Guide](/README.md)
* [Module Documentation](Module.md)
* [Props API](PropsAPI.md)

## Constructor
```ts
ModuleDataAPI(module_id: string, dataset_id: string): object
```

## Methods

### 🟣 Fetch Data
Please refer to [this](https://1drv.ms/b/s!AgYtdYq0eHSbh3RG0uOpJ4krD9iX?e=3ihtiC) link for supported properties in `parameters`.
```ts
fetch(parameters: object): Promise<object>
```
**Response:**
```ts
{
    _id: string,                            // document id
    _created_on: number,                    // UTC milliseconds
    _last_modified: number,                 // UTC milliseconds
    _created_by: string | object | null,    // user id / resolved user info / null if account deleted>

    page: number,                           // current page, -1 if page unspecified in parameters>
    count: number,                          // num of documents returned
    total_documents: number,                // total documents for the passed parameters
    
    documents: Array                        // returned documents
}
```

If  `resolve_creator: true` in parameters then response `_created_by` has resolved user info:
```ts
{
    id: string,     // user id
    fname: string,  // creator first name
    lname: string,  // creator last name
    email: string   // creator email address
}
```

<br><hr><br>

### 🟣 Fetch data from another module (a.k.a. companion)
`filtersAndOptions` follows the same `parameters` available for [fetch()](#🟣-fetch-data).
```ts
fetchFromCompanion(companion_id: string, filtersAndOptions: object): Promise<object>
```

**Response:** Same as `fetch()`

<br><hr><br>

### 🟣 Insert data
```ts
insert({ 'documents': Array<object> }): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        insert_status: number,              // (0, 1, 2) See below for its meaning
        documents_count: number,            // Number of documents given to insert
        inserted_count: number,             // Number of documents successfully inserted
        inserted_documents: Array<object>   // Inserted Documents
    }
    ```

* If `insert_status` ≠ 1
    ```ts
    {
        insert_status: number,             // (0, 1, 2) See below for its meaning
        error_message: string,              // Small error description
        inserted_documents: Array<object>   // Inserted Documents
    }
    ```

* All other types of error shall be handled by Fluidspace environment.

<details>
<summary>Values for insert_status</summary>

| insert_status | Meaning                                                                      |
|---------------|------------------------------------------------------------------------------|
| 0             | HTTP 400 - Required fields are missing<br>HTTP 200 - Operation not performed |
| 1             | Successfully inserted the documents                                          |
| 2             | No documents provided to insert. Operation not performed                     |
</details><br>

<br><hr><br>

### 🟣 Update data
```ts
update({ '_id': string, 'updates': object }): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        update_status: number,      // (1, 2, 3) See below for its meaning
        updated_count: number,      // Number of updated documents
        updated_document: object    // Copy of entire document after updating
    }
    ```

* If `update_status` ≠ 1
    ```ts
    {
        update_status: number,      // (1, 2, 3) See below for its meaning
        error_message: string      // Small error description
    }
    ```

* All other types of error shall be handled by Fluidspace environment.

<details>
<summary>Values for update_status</summary>

| update_status | Meaning                                                               |
|---------------|-----------------------------------------------------------------------|
| 1             | Successfully updated the document.                                    |
| 2             | Incomplete request, missing required fields. Operation not performed. |
| 3             | Invalid document identifier (_id)                                     |
</details><br>

<br><hr><br>

### 🟣 Delete data
```ts
delete(ids_to_delete: Array<string>): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        delete_status: number,      // (1, 2) See below for its meaning
        deleted_count: number,      // Number of deleted documents
        deleted_ids: Array<string>  // IDs of deleted documents
    }
    ```

* If `delete_status` ≠ 1
    ```ts
    {
        delete_status: number,      // (1, 2) See below for its meaning
        error_message: string,      // Small error description
        deleted_ids: Array<string>  // IDs of deleted documents
    }
    ```

* All other types of error shall be handled by Fluidspace environment.

<details>
<summary>Values for delete_status</summary>

| delete_status | Meaning                                                      |
|---------------|--------------------------------------------------------------|
| 1             | Successfully deleted the document.                           |
| 2             | No document ids provided to delete. Operation not performed. |
</details><br>

<br><br><br>

## ⛔️ General Errors
Fluidspace environment automatically handles the following errors:
* HTTP 401 (Invalid user session)
* HTTP 500 (internal server error)
* Network error 
* JSON parsing error

> A more graceful `Error` will be thrown to the API caller so, make sure to `.catch()` in all the API requests and handle them appropriately at the module level.

The message `"PARSING_ERROR"` or `"NETWORK_ERROR"` can be expected in `error.message` property in `catch()`:
