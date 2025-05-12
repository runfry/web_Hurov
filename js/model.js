class BlogModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('blogUsers')) || [];
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        // Fix existing posts with potentially invalid dates
        this.fixPostDates();
    }
    
    // Add method to fix existing post dates
    fixPostDates() {
        let needsUpdate = false;
        
        this.posts.forEach(post => {
            // Fix post date if it's invalid
            if (!post.date || new Date(post.date).toString() === 'Invalid Date') {
                post.date = new Date().toISOString();
                needsUpdate = true;
            }
            
            // Fix comment dates if they're invalid
            if (post.comments && Array.isArray(post.comments)) {
                post.comments.forEach(comment => {
                    if (!comment.date || new Date(comment.date).toString() === 'Invalid Date') {
                        comment.date = new Date().toISOString();
                        needsUpdate = true;
                    }
                });
            }
        });
        
        // Update localStorage if any fixes were made
        if (needsUpdate) {
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        }
    }

    // Користувачі
    registerUser(user) {
        if (this.users.some(u => u.email === user.email)) {
            return { success: false, message: 'Користувач з таким email вже існує' };
        }
        
        // Ensure birthdate is a valid date string
        if (user.birthdate) {
            const birthdate = new Date(user.birthdate);
            if (!isNaN(birthdate.getTime())) {
                user.birthdate = birthdate.toISOString();
            }
        }
        
        this.users.push(user);
        localStorage.setItem('blogUsers', JSON.stringify(this.users));
        return { success: true, user };
    }

    loginUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Невірний email або пароль' };
    }

    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Пости
    addPost(post) {
        post.id = Date.now();
        post.author = this.currentUser.email;
        post.date = new Date().toISOString(); // Using ISO string for consistent format
        post.comments = [];
        this.posts.unshift(post);
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        return post;
    }

    getPostById(id) {
        return this.posts.find(post => post.id === parseInt(id));
    }

    addComment(postId, commentText) {
        const post = this.getPostById(postId);
        if (post) {
            const comment = {
                id: Date.now(),
                author: this.currentUser.email,
                text: commentText,
                date: new Date().toISOString() // Using ISO string for consistent format
            };
            post.comments.push(comment);
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            return comment;
        }
        return null;
    }

    // Інше
    getCurrentUser() {
        return this.currentUser;
    }

    getAllPosts() {
        return [...this.posts];
    }
}