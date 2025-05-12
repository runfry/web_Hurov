class BlogView {
    constructor() {
        this.navElements = {
            home: document.querySelector('a[href="index.html"]'),
            addPost: document.querySelector('a[href="add-post.html"]'),
            login: document.querySelector('a[href="login.html"]'),
            register: document.querySelector('a[href="register.html"]'),
            profile: document.querySelector('a[href="profile.html"]'),
            about: document.querySelector('a[href="about.html"]')
        };
    }

    formatDate(dateString) {
        // Improved date formatting function
        if (!dateString) return 'Невідома дата';
        
        try {
            const date = new Date(dateString);
            
            // Check for invalid date
            if (isNaN(date.getTime())) {
                return 'Невідома дата';
            }
            
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('uk-UA', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Невідома дата';
        }
    }

    renderPosts(posts) {
        const postsContainer = document.querySelector('#posts-container');
        if (!postsContainer) return;

        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="text-center">Ще немає постів. Будьте першим!</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'card mb-3 post-item';
            postElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="post-detail.html?id=${post.id}" class="btn btn-primary">Читати далі</a>
                        <small class="text-muted">${this.formatDate(post.date)}</small>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    renderPostDetail(post) {
        if (!post) {
            window.location.href = 'index.html';
            return;
        }

        document.querySelector('#post-title').textContent = post.title;
        document.querySelector('#post-content').textContent = post.content;
        document.querySelector('#post-meta').innerHTML = `
            <i class="bi bi-person"></i> ${post.author} | 
            <i class="bi bi-calendar"></i> ${this.formatDate(post.date)}
        `;

        const commentsContainer = document.querySelector('#comments-container');
        commentsContainer.innerHTML = '';

        if (post.comments.length === 0) {
            commentsContainer.innerHTML = '<p class="text-muted text-center">Ще немає коментарів. Будьте першим!</p>';
        } else {
            post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'card mb-3';
                commentElement.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h6 class="card-title mb-2">${comment.author}</h6>
                            <small class="text-muted">${this.formatDate(comment.date)}</small>
                        </div>
                        <p class="card-text">${comment.text}</p>
                    </div>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    }

    renderUserProfile(user) {
        const table = document.querySelector('#profile-data');
        if (!table || !user) return;

        table.innerHTML = `
            <tr>
                <th>Ім'я</th>
                <td>${user.name}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>${user.email}</td>
            </tr>
            <tr>
                <th>Пароль</th>
                <td>********</td>
            </tr>
            <tr>
                <th>Стать</th>
                <td>${user.gender === 'male' ? 'Чоловіча' : 'Жіноча'}</td>
            </tr>
            <tr>
                <th>Дата народження</th>
                <td>${this.formatDate(user.birthdate)}</td>
            </tr>
        `;
    }

    updateNavigation(user) {
        if (user) {
            this.navElements.login.style.display = 'none';
            this.navElements.register.style.display = 'none';
            if (this.navElements.profile) {
                this.navElements.profile.style.display = 'inline-block';
                this.navElements.profile.classList.add('btn-profile');
                this.navElements.profile.classList.remove('btn-light');
            }
            if (this.navElements.addPost) {
                this.navElements.addPost.style.display = 'inline-block';
            }
        } else {
            this.navElements.login.style.display = 'inline-block';
            this.navElements.register.style.display = 'inline-block';
            if (this.navElements.profile) {
                this.navElements.profile.style.display = 'none';
            }
            if (this.navElements.addPost) {
                this.navElements.addPost.style.display = 'none';
            }
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (!element) return;

        let errorElement = element.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1';
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
        errorElement.textContent = message;
    }

    hideError(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const errorElement = element.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = '';
        }
    }
}