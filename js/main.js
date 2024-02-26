class Blog {
    #image;
    #title;
    #content;
    #author;
    #date;
    #time;
    #edit;

    constructor(image, title, content, author, date, time) {
        // Initialize private fields using constructors
        this.#image = image;
        this.#title = title;
        this.#content = content;
        this.#author = author;
        this.#date = date;
        this.#time = time;
        this.#edit = false; 
    }

    // Getters
    get image() {
        return this.#image;
    }
    get title() {
        return this.#title;
    }
    get content() {
        return this.#content;
    }
    get author() {
        return this.#author;
    }
    get date() {
        return this.#date;
    }
    get time() {
        return this.#time;
    }
    get edit() {
        return this.#edit;
    }

    // Method to toggle edit mode
    toggleEdit() {
        this.#edit = !this.#edit;
    }
}


// Function to add a blog 
const addPerson = (person, parent) => {
    const row = document.createElement('div');
    const col1 = document.createElement('div');
    const col2 = document.createElement('div');
    parent.appendChild(row);
    row.appendChild(col1);
    row.appendChild(col2);
    const image = document.createElement('img');
    const title = document.createElement('h1');
    const author = document.createElement('h3');
    const content = document.createElement('p');
    const date = document.createElement('h4');
    const time = document.createElement('h4');
    const editButton = document.createElement('button');
    col1.appendChild(image);
    col2.appendChild(title);
    col2.appendChild(author);
    col2.appendChild(content);
    col2.appendChild(date);
    col2.appendChild(time);
    editButton.classList.add('edit');

    // Function to update fields
    const updateFields = () => {
        image.src = person.image;
        title.textContent = person.title;
        author.textContent = person.author;
        content.textContent = person.content;
        date.textContent = person.date;
        time.textContent = person.time;
    };

    // Function to make fields editable or not
    const setEditable = (editable) => {
        const fields = [author, content];
        fields.forEach((field) => {
            field.contentEditable = editable;
        });
    };

    // Function to toggle content expansion/collapse
    const toggleContent = () => {
        if (content.classList.contains('content-collapsed')) {
            content.style.maxHeight = 'none'; // Expand fully
            content.classList.remove('content-collapsed');
        } else {
            content.style.maxHeight = '200px'; // Collapse
            content.classList.add('content-collapsed');
        }
    };

    updateFields();

        // Check if the blog is in edit mode
    if (person.edit) {
        // Fields are editable in edit mode
        setEditable(true);
    }

    editButton.textContent = person.edit ? 'Save' : 'Edit';
    col2.appendChild(editButton);

    editButton.addEventListener('click', () => {
        if (person.edit) {
            // Save changes
            person.image = image.src;
            person.title = title.textContent;
            person.author = author.textContent;
            person.content = content.textContent;
            person.date = date.textContent;
            person.time = time.textContent;

            
            person.toggleEdit();

            // Update fields
            setEditable(false);
            editButton.textContent = 'Edit';
        } else {
            // Enter edit mode
            setEditable(true);
            editButton.textContent = 'Save';
            person.toggleEdit();
        }
    });

    title.classList.add('data2');
    row.classList.add('main');
    col1.classList.add('col1');
    col2.classList.add('col2');
    content.classList.add('content');
    content.classList.add('content1');
    image.classList.add('imgs');
    content.classList.add('content-collapsed');

    content.addEventListener('click', () => {
        toggleContent();
    });
};

// Get the main container for blogs
const mainDiv = document.getElementById('data1');
const blogList = [];

// Fetch blogs 
const fetchBlog = () => {
    const blogURI = '/data/blog.json';
    const xhr = new XMLHttpRequest();
    xhr.open('GET', blogURI);
    xhr.addEventListener('load', function () {
        if (this.status === 200) {
            const responseText = this.responseText;
            const BlogList = JSON.parse(responseText);
            BlogList.forEach((item) => {
                const person = new Blog(item.image, item.title, item.content, item.author, item.date, item.time);
                blogList.push(person);
            });
            refreshBlogs();
        }
    });
    xhr.send();
};

fetchBlog();

// Refresh the displayed blogs
const refreshBlogs = () => {
    mainDiv.innerHTML = '';
    blogList.forEach((blog) => {
        addPerson(blog, mainDiv);
    });
};

//EventListener
document.addEventListener('DOMContentLoaded', function () {
    const createBlogButton = document.getElementById('createBlogButton');
    const createBlogModal = document.getElementById('createBlogModal');
    const closeModal = document.getElementById('closeModal');
    const showFieldsButton = document.getElementById('showFields');
    const saveBlogButton = document.getElementById('saveBlog');
    const inputFields = document.querySelectorAll('.input-field');

    const showModal = () => {
       
        inputFields.forEach(field => {
            field.value = '';
        });

        createBlogModal.style.display = 'block';
    };

    const closeModalHandler = () => {
        createBlogModal.style.display = 'none';
    };

    createBlogButton.addEventListener('click', showModal);
    closeModal.addEventListener('click', closeModalHandler);

    showFieldsButton.addEventListener('click', () => {
        inputFields.forEach(field => {
            field.classList.remove('hidden');
        });
        showFieldsButton.classList.add('hidden');
        saveBlogButton.classList.remove('hidden');
    });

     // Function to save a new blog entry
    saveBlogButton.addEventListener('click', () => {
        // Retrieve input values and create a new blog entry
        const image = document.getElementById('blogImage').value;
        const title = document.getElementById('blogTitle').value;
        const author = document.getElementById('blogAuthor').value;
        const content = document.getElementById('blogContent').value;
        const date = document.getElementById('blogDate').value;
        const time = document.getElementById('blogTime').value;

        const newBlog = new Blog(image, title, content, author, date, time);
        blogList.push(newBlog); // Add the new blog to the list
        refreshBlogs();

        // Clear input fields
        inputFields.forEach(field => {
            field.value = '';
        });

        // Close the modal
        closeModalHandler();
    });
});

