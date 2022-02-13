import { getNotes } from '~/utils/notes.server';
import { Link, useLoaderData,
    Outlet,
    useCatch} from 'remix';

import { getUser, getUserId, requireUserId } from "~/utils/auth.server"; 

import { db } from "~/utils/db.server";

export const loader = async ({
    request
  }) => {
    const userId = await getUserId(request);
    if (!userId) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const notes = await getNotes();

    const user = await getUser(request);

    const data = {
        notes,
        user
    };
    
    return data;
}

export const action = async ({
    request
  }) => {
    const form = await request.formData();
    if (form.get("_method") === "delete") {
      const userId = await requireUserId(request);
      const noteId = form.get("id");
      const note = await db.notes.findUnique({
        where: { id: noteId }
      });

      if (!note) {
        throw new Response(
          "Can't delete what does not exist",
          { status: 404 }
        );
      }

      if (note.user !== userId) {
        throw new Response(
          "That's not your note",
          {
            status: 401
          }
        );
      }
      console.log(note);
      console.log(noteId);
      await db.notes.delete({ where: { id: noteId } });
      return redirect("/notes");
    }
  };
  
export default function Notes() {
    let data = useLoaderData();
    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
            <Link className="navbar-brand" to="/notes">
                Notes
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                {<ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className={`nav-link text-light`} to="addNote">
                    Create Note
                    </Link>
                </li>
                </ul>}
                {data.user ? (
                <div className="user-info text-light">
                <span>{`Hi ${data.user.email}`}</span>
                <form action="logout" method="post">
                    <button type="submit" className="btn btn-light">
                    Logout
                    </button>
                </form>
                </div>
                ) : (
                    <>
                    <Link className="btn btn-dark mx-2 " to="/signup"  role="button">Signup</Link>
                    <Link className="btn btn-dark mx-2 " to="/login" role="button">Login</Link>
                    </>
                )}
            </div>
            </div>
        </nav>
        <main>
            <Outlet />
        </main>
        <div className="page-content container note-has-grid mt-5">
            <div className="tab-content bg-transparent">
                <div id="note-full-container" className="note-has-grid row">
                    {data.notes.map(note => (
                    <div className="col-md-4 single-note-item all-category note-social" key={note.id}>
                        <div className="card card-body">
                            <span className="side-stick"></span>
                            <Link to={note.id}><h5 className="note-title text-truncate w-75 mb-0">{note.title}<i className="point fa fa-circle ml-1 font-10"></i></h5></Link>
                            <p className="note-date font-12 text-muted">{note.date}</p>
                            <div className="note-content">
                                <p className="note-inner-content text-muted">{note.description}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <form method="post">
                                <input
                                    type="hidden"
                                    name="_method"
                                    value="delete"
                                />
                                <input
                                    type="hidden"
                                    name="id"
                                    value={note.id}
                                />
                                <span className="mr-1" type="submit">
                                <button type="submit" className="fabutton">
                                    <i className="fa fa-trash remove-note"></i> 
                                </button>
                                </span>
                                </form>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    )
}

export function CatchBoundary() {
    const caught = useCatch();

    switch (caught.status) {
      case 404: {
        return (
          <div className="error-container">
            note doesn't exist?
          </div>
        );
      }
      case 401: {
        return (
          <div className="error-container">
            <p>You must be logged in.</p>
            <Link to="/login">Login</Link>
          </div>
        );
      }
      default: {
        throw new Error(`Unhandled error: ${caught.status}`);
      }
    }
  }
  
export function ErrorBoundary() {
    return (
      <div className="error-container">
        Something unexpected went wrong.
      </div>
    );
}
  
  