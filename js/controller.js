class BlogController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.initEvents();
        this.handleRoute();
        this.updateUI();
    }

    initEvents() {
        // Реєстрація
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Вхід
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Додавання поста
        const addPostForm = document.getElementById('addPostForm');
        if (addPostForm) {
            addPostForm.addEventListener('submit', (e) => this.handleAddPost(e));
        }

        // Додавання коментаря
        const addCommentForm = document.getElementById('addCommentForm');
        if (addCommentForm) {
            addCommentForm.addEventListener('submit', (e) => this.handleAddComment(e));
        }

        // Вихід
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Відстеження змін маршруту
        window.addEventListener('popstate', () => this.handleRoute());
    }

    handleRoute() {
        const path = window.location.pathname.split('/').pop();
        
        if (path === 'post-detail.html') {
            const urlParams = new URLSearchParams(window.location.search);
            const postId = parseInt(urlParams.get('id'));
            
            if (!postId) {
                window.location.href = 'index.html';
                return;
            }
            
            const post = this.model.getPostById(postId);
            this.view.renderPostDetail(post);
        } else if (path === 'index.html') {
            const posts = this.model.getAllPosts();
            this.view.renderPosts(posts);
        } else if (path === 'profile.html') {
            const user = this.model.getCurrentUser();
            this.view.renderUserProfile(user);
        }
    }

    updateUI() {
        const currentUser = this.model.getCurrentUser();
        this.view.updateNavigation(currentUser);
    }

    handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const gender = document.getElementById('gender').value;
        const birthdate = document.getElementById('birthdate').value;

        if (!name || !email || !password || !gender || !birthdate) {
            alert('Будь ласка, заповніть всі обов\'язкові поля');
            return;
        }

        const result = this.model.registerUser({
            name,
            email,
            password,
            gender,
            birthdate
        });

        if (result.success) {
            alert('Реєстрація успішна! Тепер ви можете увійти.');
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = this.model.loginUser(email, password);
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    }

    handleAddPost(e) {
        e.preventDefault();
        
        const currentUser = this.model.getCurrentUser();
        if (!currentUser) {
            alert('Будь ласка, увійдіть до системи, щоб додати пост');
            window.location.href = 'login.html';
            return;
        }

        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;

        if (!title || !content) {
            alert('Будь ласка, заповніть всі поля');
            return;
        }

        const post = this.model.addPost({ title, content });
        window.location.href = `post-detail.html?id=${post.id}`;
    }

    handleAddComment(e) {
        e.preventDefault();
        
        const currentUser = this.model.getCurrentUser();
        if (!currentUser) {
            alert('Будь ласка, увійдіть до системи, щоб залишити коментар');
            window.location.href = 'login.html';
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const postId = parseInt(urlParams.get('id'));
        const commentText = document.getElementById('comment').value;

        if (!commentText) {
            alert('Будь ласка, введіть текст коментаря');
            return;
        }

        this.model.addComment(postId, commentText);
        document.getElementById('comment').value = '';
        this.handleRoute(); // Оновлюємо сторінку для відображення нового коментаря
    }

    handleLogout() {
        this.model.logoutUser();
        window.location.href = 'index.html';
    }
}