import { getNotes } from '~/utils/notes';
import { Link, useLoaderData,
    Outlet,
    useCatch,
    redirect,
    useParams} from 'remix';

export let loader = () => {
    if (!getNotes()) {
        throw new Response("No notes to display", {
          status: 404
        });
    }else{
        return getNotes();
    }
}

export default function Notes() {
    let notes = useLoaderData();
    return (
        <>
        <div>
            <h1>My Remix Notes</h1>
            <p>Click on the note name to read the note</p>
            <ul>
                {notes.map(note => (
                    <li className="postList" key={note.id}>
                        <Link className="postTitle" to={note.id}>{note.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
            <Link className="navbar-brand" to="/">
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
                <li className="nav-item">
                    <Link className={`nav-link text-light`} to="/About">
                    About
                    </Link>
                </li>
                </ul>}
                {/* {!localStorage.getItem('token')?<form classNameNameName="d-flex ">
                
                <Link className="btn btn-dark mx-2 " to="/signup"  role="button">Signup</Link>
                <Link className="btn btn-dark mx-2 " to="/login" role="button">Login</Link>
                </form>:<button className="btn btn-dark" onClick={handleLogout}>Logout</button>} */}
            </div>
            </div>
        </nav>
        <main>
            <Outlet />
        </main>
        <div className="page-content container note-has-grid mt-5">
            <div className="tab-content bg-transparent">
                <div id="note-full-container" className="note-has-grid row">
                    <div className="col-md-4 single-note-item all-category note-important">
                        <div className="card card-body">
                            <span className="side-stick"></span>
                            <h5 className="note-title text-truncate w-75 mb-0" data-noteheading="Go for lunch">Go for lunch <i className="point fa fa-circle ml-1 font-10"></i></h5>
                            <p className="note-date font-12 text-muted">01 April 2002</p>
                            <div className="note-content">
                                <p className="note-inner-content text-muted" data-notecontent="Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.">Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="mr-1"><i className="fa fa-star favourite-note"></i></span>
                                <span className="mr-1"><i className="fa fa-trash remove-note"></i></span>
                                <div className="ml-auto">
                                    <div className="category-selector btn-group">
                                        <a className="nav-link dropdown-toggle category-dropdown label-group p-0" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="true">
                                            <div className="category">
                                                <div className="category-business"></div>
                                                <div className="category-social"></div>
                                                <div className="category-important"></div>
                                                <span className="more-options text-dark"><i className="icon-options-vertical"></i></span>
                                            </div>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right category-menu">
                                            <a className="note-business badge-group-item badge-business dropdown-item position-relative category-business text-success" href="javascript:void(0);">
                                                <i className="mdi mdi-checkbox-blank-circle-outline mr-1"></i>Business
                                            </a>
                                            <a className="note-social badge-group-item badge-social dropdown-item position-relative category-social text-info" href="javascript:void(0);">
                                                <i className="mdi mdi-checkbox-blank-circle-outline mr-1"></i> Social
                                            </a>
                                            <a className="note-important badge-group-item badge-important dropdown-item position-relative category-important text-danger" href="javascript:void(0);">
                                                <i className="mdi mdi-checkbox-blank-circle-outline mr-1"></i> Important
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {/* modal */}
        {/* <div className="modal fade" id="addnotesmodal" tabindex="-1" role="dialog" aria-labelledby="addnotesmodalTitle" style={{display: "none"}} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content border-0">
                    <div className="modal-header bg-info text-white">
                        <h5 className="modal-title text-white">Add Notes</h5>
                        <button type="button" className="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="notes-box">
                            <div className="notes-content">
                                <form action="javascript:void(0);" id="addnotesmodalTitle">
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <div className="note-title">
                                                <label>Note Title</label>
                                                <input type="text" id="note-has-title" className="form-control" minlength="25" placeholder="Title" />
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="note-description">
                                                <label>Note Description</label>
                                                <textarea id="note-has-description" className="form-control" minlength="60" placeholder="Description" rows="3"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button id="btn-n-save" className="float-left btn btn-success" style={{display: "none"}}>Save</button>
                        <button className="btn btn-danger" data-dismiss="modal">Discard</button>
                        <button id="btn-n-add" className="btn btn-info" disabled="disabled">Add</button>
                    </div>
                </div>
            </div>
        </div> */}
    </div>
    </>
    )
}

// export function CatchBoundary() {
//     const caught = useCatch();
  
//     if (caught.status === 404) {
//       return (
//         <div className="error-container">
//           There are no jokes to display.
//         </div>
//       );
//     }
//     throw new Error(
//       `Unexpected caught response with status: ${caught.status}`
//     );
// }
  
// export function ErrorBoundary() {
//     return (
//       <div className="error-container">
//         I did a whoopsies.
//       </div>
//     );
// }
  