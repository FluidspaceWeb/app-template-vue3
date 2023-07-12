# Props API Specification

Use Props to store user preferences, configuration, data relations, module settings, etc.

Total number of Props per module per dataset is limited and must be used wisely.

## 🔖 Docs Index
* [What is Fluidspace?](https://gist.github.com/rishiktiwari/645f48422aad7ca7781d1142b3f3b1bd)
* [Installation Guide](/README.md)
* [Module Documentation](Module.md)
* [Data API](DataAPI.md)

## Constructor
```ts
ModulePropsAPI(module_id: string, dataset_id: string): object
```

## Methods

### 🟣 Get Props
Please refer to [this](https://1drv.ms/b/s!AgYtdYq0eHSbh3NuPoT31_drDDwF?e=XQ0aZ6) link for supported `filtersAndOptions` properties.
```ts
getProps(filtersAndOptions: object): Promise<Array>
```

**Response:**
```ts
[
    {
        _id: string,            // document id
        _created_on: number,    // UTC milliseconds
        "<prop_name>": "key",   // You prop data
        ...
    },
    ...
]
```

<br><hr><br>

### 🟣 Insert Props
```ts
insertProps({ 'props': Array<object> }): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        insert_status: number,              // (0, 1, 2, 3) See below for its meaning
        props_count: number,                // Number of props given to insert
        inserted_count: number,             // Number of props successfully inserted
        inserted_props: Array<object>       // Copy of inserted props
    }
    ```

* For other responses read [General Errors](#⛔️-general-errors).

<details>
<summary>Values for insert_status</summary>

| insert_status | Meaning                                                                       |
|---------------|-------------------------------------------------------------------------------|
| 0             | Invalid Request Type,  HTTP Status 400 (Bad Request)                          |
| 1             | Successfully inserted the props                                               |
| 2             | No props to insert. Operation not performed                                   |
| 3             | No props inserted, number of props exceeds allowed limit of props per dataset |
</details><br>

<br><hr><br>

### 🟣 Update Prop
```ts
updateProp({ 'prop_id': string, 'prop_updates': object }): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        update_status: number,      // (1, 2, 3) See below for its meaning
        updated_prop: object        // Copy of entire prop after updating
    }
    ```

* If `update_status` ≠ 1
    ```ts
    {
        update_status: number,      // (1, 2, 3) See below for its meaning
        error_message: string       // Small error description
    }
    ```

* For other responses read [General Errors](#⛔️-general-errors).

<details>
<summary>Values for update_status</summary>

| update_status | Meaning                                                               |
|---------------|-----------------------------------------------------------------------|
| 1             | Successfully updated the prop.                                        |
| 2             | Incomplete request, missing required fields. Operation not performed. |
| 3             | Could not find prop by specified prop_id                              |
</details><br>

<br><hr><br>

### 🟣 Delete Props
```ts
deleteProp(prop_ids_to_delete: Array<string>): Promise<object>
```

**Response:**

* If response is *OK*
    ```ts
    {
        delete_status: number,      // (0, 1, 2) See below for its meaning
        deleted_count: number,      // Number of deleted props
        deleted_ids: Array<string>  // IDs of deleted props
    }
    ```

* If `delete_status` ≠ 1
    ```ts
    {
        delete_status: number,      // (0, 1, 2) See below for its meaning
        error_message: string,      // Small error description
    }
    ```

* For other responses read [General Errors](#⛔️-general-errors).

<details>
<summary>Values for delete_status</summary>

| delete_status | Meaning                                                  |
|---------------|----------------------------------------------------------|
| 0             | Invalid Request Type or Invalid prop ID(s)               |
| 1             | Successfully deleted the props.                          |
| 2             | No prop IDs provided to delete. Operation not performed. |
</details><br>

<br><hr><br>

### 🟡 Get all space users

```ts
getWorkspaceUsers(forceFetch: boolean = false): Promise<Array>
```

The list of users in the space is locally cached for some time. To bypass cache and get fresh list of users set `forceFetch` to true. It is recommended to **not** forceFetch unless required as it unnecessarily burdens the server.
<br><br>

**Response:**

```ts
[
    {
        _id: string,    // user id
        email: string,  // user address
        fname: string,  // first name
        lname: string,  // last name
        img: string     // user profile picture full URL
    },
    ...
]
```

<br><hr><br>

### 🟡 Get current user

```ts
getUser(): Promise<object>
```

**Response:**

```ts
{
    _id: string,    // user id
    email: string,  // user address
    fname: string,  // first name
    lname: string,  // last name
    img: string     // user profile picture full URL
}
```

<br><hr><br>

### 🟡 Get Manifest File

```ts
getStaticConfig(): object
```

**Response:**

All the content of manifest.json file parsed to object type.

<br><br><br>

## ⛔️ General Errors
In all the case when HTTP response is **OK (200)** but the request was not fulfilled, a response of following type must be expected and handled:
```ts
{
    <action>_status: number // (insert, update, delete) action status code
    message: string         // short error description
}
```

Fluidspace environment automatically handles the following errors:
* HTTP 401 (Invalid user session)
* HTTP 500 (internal server error)
* Network error 
* JSON parsing error

> A more graceful `Error` will be thrown to the API caller so, make sure to `.catch()` in all the API requests and handle them appropriately at the module level.

The message `PARSING_ERROR` or `NETWORK_ERROR` can be expected in `error.message` property in `catch()`:
