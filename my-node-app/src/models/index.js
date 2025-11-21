export const UserModel = {
    name: 'User',
    schema: {
        id: { type: 'string', required: true },
        username: { type: 'string', required: true },
        email: { type: 'string', required: true },
        password: { type: 'string', required: true },
    }
};

export const PostModel = {
    name: 'Post',
    schema: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        content: { type: 'string', required: true },
        authorId: { type: 'string', required: true },
    }
};

export const CommentModel = {
    name: 'Comment',
    schema: {
        id: { type: 'string', required: true },
        postId: { type: 'string', required: true },
        content: { type: 'string', required: true },
        authorId: { type: 'string', required: true },
    }
};