import { redirect, Form, useActionData, useTransition, useLoaderData } from "remix";
import { getNoteEdit, updateNote } from '~/utils/notes.server';

export let loader = async({params}) => {
    return getNoteEdit(params.edit);
}

export let action = async ({ request }) => {
    let formData = await request.formData();

    let title = formData.get("title");
    let description = formData.get("description")
    let tag = formData.get("tag")
    let id = formData.get("id");

    let errors = {};
    if (!title) errors.title = true;
    if (!description) errors.description = true;
    if (!tag) errors.tag = true;

    if (Object.keys(errors).length) {
        return errors;
    }

    await updateNote({id, title, description, tag});

    return redirect("/notes")
}

export default function edit() {
    let errors = useActionData();
    let transition = useTransition();
    let note = useLoaderData();
    return (
    <div className="container my-3">
        <h2>Edit a Note</h2>
        <Form method="post">
            <input className="hiddenBlogID" name="id" defaultValue={note.id} />
            <div className="mb-3">
                <label htmlFor="title" className="form-label">
                    Note Title: {" "} {errors?.title && <em>Title is required</em>} 
                    <input type="text" className="form-control" id="title" name="title" defaultValue={note.title}/>
                </label>
            </div>
            <div className="col-md-12">
                  <div className="note-description">
                <label htmlFor="description" className="form-label"> Note Description: {" "} {errors?.description && <em>Description is required</em>} 
                    <textarea defaultValue={note.description} name="description" id="description" minLength="60" placeholder="Description" rows="3"/>
                </label>
                   </div>
            </div>
            <div className="mb-3">
                <label htmlFor="tag" className="form-label">Tag:</label>{" "} {errors?.tag && <em>Tag is required</em>} 
                    <input className="form-control" defaultValue={note.tag} id="tag" type="text" name="tag"/>
            </div>
                <button type="submit" className="btn btn-primary">{transition.submission ? "Updating..." : "Update Note"}</button>
        </Form>
    </div>
    );
}

export function ErrorBoundary() {
    return (
      <div className="error-container">
        Something unexpected went wrong. Sorry about that.
      </div>
    );
  }