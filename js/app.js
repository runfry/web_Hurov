document.addEventListener('DOMContentLoaded', () => {
    const model = new BlogModel();
    const view = new BlogView();
    const controller = new BlogController(model, view);
});