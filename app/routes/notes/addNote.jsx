import { redirect, Form, useActionData, useTransition } from "remix";
import { createNote } from '~/utils/notes.server';

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

    await createNote(request, {title, description, tag});

    return redirect("/notes")
}


export default function addNote() {
    // pull in errors from our action using the useActionData() hook
    let errors = useActionData();
    // transition will allow us to create a better user experience by updating the text of the submit button while creating notes
    let transition = useTransition();

  return (
    <div className="container my-3">
        <h1>Add a note</h1>
        <Form className="my-3" method="post">
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                   Note Title: {" "} {errors?.title && <em>Title is required</em>} 
                   <input className="form-control" type="text" name="title" minLength={5} required/>
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">
                     Note Description: {" "} {errors?.description && <em>Description is required</em>} 
                     <input type="text" name="description" className="form-control" minLength={5} required />
                </label>
            </div>
            <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                    Note Tag: {" "} {errors?.tag && <em>Tag is required</em>} 
                    <input type="text" name="tag" className="form-control" required/>
                </label>
            </div>
            <button type="submit" className="btn btn-primary">{transition.submission ? "Creating..." : "Add Note"}</button>
        </Form>
    </div>
  )
} 

export function ErrorBoundary() {
    return (
      <div className="error-container">
        Something unexpected went wrong.
      </div>
    );
}