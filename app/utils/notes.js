import { PrismaClient } from '@prisma/client'
// create a reference to prisma
const prisma = new PrismaClient();

export async function getNotes(){
    // await prisma connection
    await prisma.$connect()
    // grab all notes using findMany()
    // the posts in prisma.notes is the collection we created in Mongo.db
    const allNotes = await prisma.notes.findMany();
    // let's cleanup our connection
    prisma.$disconnect();
    // let's see what we are returning
    //  console.log(allNotes)
    return allNotes;
}

export async function getNote(id){
    // setup our prisma connection
    await prisma.$connect();

    // find the first database entry that matches the passed id
    const foundId = await prisma.notes.findFirst({
        where: {
            id: id
        }
    })

    // extract the data 
    let title = foundId.title;
    let description = foundId.description;
    let tag = foundId.tag;
    let date = foundId.date;
    // cleanup our database connection.
    prisma.$disconnect();

    // send back the title, description, tag and date. 
    return { title, description, tag, date };
}

export async function getNoteEdit(id){
    //setup our prisma connection
    await prisma.$connect();

    // find the first database entry that matches the passed id
   const foundId = await prisma.notes.findFirst({
        where: {
            id: id
        }
    })

    // extract the data 
    let title = foundId.title;
    let description = foundId.description;
    let tag = foundId.tag;
    // cleanup our database connection
    prisma.$disconnect();

    // send back the slug, the title, and our markdown converted to html 
    return { id, title, description, tag };
}

export async function createNote(note){
    console.log(note);
    //Prisma connection 
    await prisma.$connect()
    // prisma create
    await prisma.notes.create({
        data: {
            title: note.title,
            description: note.description,
            tag: note.tag,
            date: Date().toLocaleString()
        }
    })

    // cleanup prisma connection 
    prisma.$disconnect();
    // send back the id we created
    return getNotes()    
}

export async function updateNote(note){
    //Prisma connection 
    await prisma.$connect()
    // prisma create
    await prisma.notes.update({
        where: {
            id: note.id
        },
        data: {
            title: note.title,
            description: note.description,
            tag: note.tag,
        }
    })

    // cleanup prisma connection 
    prisma.$disconnect();
    // send back the id we created
    return getNote(note.id)    
}