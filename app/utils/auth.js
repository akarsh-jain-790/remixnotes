import { PrismaClient } from '@prisma/client'
// create a reference to prisma
const prisma = new PrismaClient();

export async function getNote(id){
    //setup our prisma connection
    await prisma.$connect();

    // find the first database entry that matches the passed id
    const foundId = await prisma.notes.findFirst({
        where: {
            id: id
        }
    })

    //let's extract the data 
    let title = foundId.title;
    let description = foundId.description;
    let tag = foundId.tag;
    let date = foundId.date;
    // cleanup our database connection.
    prisma.$disconnect();

    // send back the title, description, tag and date. 
    return { title, description, tag, date };
}