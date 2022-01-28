import fetch from 'node-fetch'


const SERVERURL = 'https://drfnext.nhagit.repl.co/'

export async function getAllPostsData() {
    const res = await fetch(new URL(`${SERVERURL}api/post/`))
    const posts = await res.json()
    return posts
}

export async function getAllPostIds() {
    const res = await fetch(new URL(`${SERVERURL}api/post/`))
    const posts = await res.json()
    return posts.map((post) => {
        return {
            params: {
                id: String(post.id),
            },
        }
    })
}

export async function getPostData(id) {
    const res = await fetch(new URL(`${SERVERURL}api/post/${id}/`))
    const post = await res.json()
    return post
}