import { redirect, Form, useActionData, useTransition, useLoaderData } from "remix";
import { getNoteEdit } from '~/utils/notes';
import { updateNote } from '~/utils/notes';

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

    console.log('calling updatePost with id, title, slug, markdown: ', id, title, description, tag)
    await updateNote({id, title, description, tag});

    return redirect("/notes")
}

export default function edit() {
    let errors = useActionData();
    let transition = useTransition();
    let note = useLoaderData();
    return (
        <Form method="post">
            <p>
                <input className="hiddenBlogID" name="id" value={note.id}>
                </input>
            </p>
            <p>
                <label htmlFor="">
                    Note Title: {" "} {errors?.title && <em>Title is required</em>} <input type="text" name="title" defaultValue={note.title}/>
                </label>
                </p>
                <p>
                    <label htmlFor=""> Post Description: {" "} {errors?.description && <em>Description is required</em>} 
                    <input defaultValue={note.description} id="description" type="text" name="description"/>
                </label>
                </p>
                <p>
                    <label htmlFor="tag">Tag:</label>{" "} {errors?.tag && <em>Tag is required</em>} 
                    <br />
                    <textarea defaultValue={note.tag} name="tag" id="" rows={20} cols={30}/>
                </p>
                <p>
                    <button type="submit">{transition.submission ? "Updating..." : "Update Note"}</button>
                </p>
        </Form>
    );
}