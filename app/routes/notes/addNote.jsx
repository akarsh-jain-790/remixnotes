import { redirect, Form, useActionData, useTransition } from "remix";
import { createNote } from '~/utils/notes';

export let action = async ({ request }) => {
    let formData = await request.formData();
    let title = formData.get("title");
    let description = formData.get("description");
    let tag = formData.get("tag");

    let errors = {};
    if (!title) errors.title = true;
    if (!description) errors.description = true;
    if (!tag) errors.tag = true;

    if (Object.keys(errors).length) {
        return errors;
    }

    await createNote({title, description, tag});

    return redirect("/notes")
}


export default function addNote() {
    // pull in errors from our action using the useActionData() hook
    let errors = useActionData();
    // transition will allow us to create a better user experience by updating the text of the submit button while creating the blog post
    let transition = useTransition();

  return (
      <Form method="post">
          <p>
              <label htmlFor="">
                  Note Title: {" "} {errors?.title && <em>Title is required</em>} <input type="text" name="title"/>
              </label>
            </p>
            <p>
                <label htmlFor="">
                    Note Description: {" "} {errors?.description && <em>Description is required</em>} <input type="text" name="description"/>
                </label>
            </p>
            <p>
                <label htmlFor="">
                    Note Tag: {" "} {errors?.tag && <em>Tag is required</em>} <input type="text" name="tag"/>
                </label>
            </p>
            <p>
                <button type="submit">{transition.submission ? "Creating..." : "Create Post"}</button>
            </p>
      </Form>
  )
} 