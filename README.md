# fe-05 : Rest

This repo has starter files for an application that does REST CRUD for a ToDo List. Our goal for this exercise is to add the ability to edit existing ToDos (to change their title and description).

## Recommended Steps

#### 0 - Initial Setup

Perform the steps we are used to for every repository setup.

<details>
<summary> <i>Hint: Initial Setup</i> </summary>

1. Clone the Repo
2. Open GitBash at the repo root folder.
3. Run `npm install`
4. Run `npm run test:install`
5. Run `npm start`
6. (In a new GitBash window) Run `npm run test:unit` (these will fail, it's fine)
7. (In a new GitBash window) Run `npm run test:e2e` (these will fail, it's fine)
8. Open the project in VS Code
9. Open the browser to http://localhost:5173

</details>

<br/><br/>

#### 1 - Review Provided HTML Markup

I've provided the HTML markup for this exercise. But still take a look at `index.html` to familiarize yourself with what's there. In particular, notice the `<dialog id="editDialog">` and its children.

There are also matching `querySelector` statements at the top of `main.ts`.

<br/><br/>

#### 2 - Write the Edit Request

Visit `src/ToDosAPI/update.ts` and fill in the implementation for the existing `editToDo` function. It should build a Request to make a `PATCH` call to `http://localhost:3000/todos/${id}`, setting the request body to be a JSON-encoded string representation of the `editedToDo` parameter.

The rest of the function should mimic toggleToDo (as far as `fetch()` / error checking / `response.json()` parts go).

If you've done this correctly, the unit test for `update.test.ts` should pass.

<details>
<summary> <i>What my `Request` code looks like...</i> </summary>

```ts
const request = new Request(`http://localhost:3000/todos/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(editedToDo),
});
// followed by the common fetch() / error checking / response.json() stuff
```

</details>

<br/><br/>

#### 3 - Update the ToDosAPI export

Visit `src/ToDosAPI/index.ts` and edit the exported object so that the `update` property includes (similar to `toggleToDo`) an `edit` field that exposes the `editToDo` function from Step 2.

If you've done this correctly, the unit test for `index.test.ts` should pass.

<details>
<summary> <i>What my `update` code looks like...</i> </summary>

```ts
update: {
  edit: editToDo,
  toggle: toggleToDo,
},
```

</details>

<br/><br/>

#### 4 - Add Edit Button and Show Edit Modal

Visit `main.ts` inside the `data.forEach` that creates the ToDo items (look for the Step 4 comment).

Create an element for the edit button. Its `innerText` can be set to `'✏️'` (which will result in the ✏️). Its `onclick` should be a function that:

- sets the `editIdInput.value` to the `todo.id`
- sets the `editTitleInput.value` to the `todo.title`
- sets the `editDescriptionInput.value` to the `todo.description`
- calls `showModal()` on the `editDialog`

Then make sure to append your edit button to the `li`. There's some CSS already in `styles.css` that affects `li div` and `li button` that makes the layout look like this:

![step_4](./steps/step4.png)

<details>
<summary> <i>What my button code looks like...</i> </summary>

```ts
const editToDoButton = document.createElement('button');
editToDoButton.innerText = '✏️';
editToDoButton.onclick = () => {
  editIdInput.value = todo.id;
  editTitleInput.value = todo.title;
  editDescriptionInput.value = todo.description;
  editDialog.showModal();
};
li.append(editToDoButton);
```

</details>

<br/><br/>

#### 5 - Perform the Edit

Visit `main.ts` and add a click event listener to the `editButton` (not the one from Step 4, but the one in the edit dialog) that makes a call to `ToDosAPI.update.edit()` with the information from the form. It should `await` that edit call, and then `loadToDos()` to refresh the displayed list. If all is correct, you should see the ToDo item information update in the list.

<details>
<summary> <i>What my event listener code looks like...</i> </summary>

```
editButton.addEventListener('click', async () => {
  const id = editIdInput.value;
  const title = editTitleInput.value;
  const description = editDescriptionInput.value;

  await ToDosAPI.update.edit(id, { title, description });

  loadToDos();
});
```

</details>

<br/><br/>

#### 6 - Test and Submit

At this point, your e2e tests should be passing. Verify that, commit, and push your changes. 🎉
