// // Cau 1
// function Product(id, name, price, quantity, category, isAvailable) {
//   this.id = id;
//   this.name = name;
//   this.price = price;
//   this.quantity = quantity;
//   this.category = category;
//   this.isAvailable = isAvailable;
// }
// // cau 2
// const products = [
//   new Product(1, "acer gaming", 35000000, 10, "Laptops", true),
//   new Product(2, "readmi 12", 28000000, 5, "Phones", true),
//   new Product(3, "readmi 13", 32000000, 3, "Phones", true),
//   new Product(4, "readmi 14", 29000000, 0, "Phones", false),
//   new Product(5, "readmi 15", 6000000, 15, "Phones", true),
//   new Product(5, "AirPods Pro", 6000000, 15, "Accessories", true),
//   new Product(5, "logitech superlight 2", 500000, 15, "Accessories", false),
//   new Product(6, "readmi 16", 2500000, 0, "Phones", false)
// ];
// // cau 3
// const nameAndPrice = products.map(p => ({
//   name: p.name,
//   price: p.price
// }));

// console.log(nameAndPrice);

// //cau 4
// const inStockProducts = products.filter(p => p.quantity > 0);

// console.log(inStockProducts);

// //cau 5
// const hasExpensiveProduct = products.some(p => p.price > 30000000);

// console.log(hasExpensiveProduct);

// //cau 6
// const accessoriesAvailable = products
//   .filter(p => p.category === "Accessories")
//   .every(p => p.isAvailable === true);

// console.log(accessoriesAvailable);
// //cau 7
// const totalInventoryValue = products.reduce(
//   (total, p) => total + p.price * p.quantity,
//   0
// );

// console.log(totalInventoryValue);

// //cau 8
// for (const product of products) {
//   const status = product.isAvailable ? "Đang bán" : "Ngừng bán";
//   console.log(`${product.name} - ${product.category} - ${status}`);
// }

// //cau 9
// for (const key in products[0]) {
//   console.log(`${key}: ${products[0][key]}`);
// }

// // cau 10
// const availableAndInStockNames = products
//   .filter(p => p.isAvailable && p.quantity > 0)
//   .map(p => p.name);

// console.log(availableAndInStockNames);
async function LoadPosts() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();

    let body = document.getElementById("body_table");
    body.innerHTML = "";

    for (let post of posts) {
        let cls = post.isDeleted ? "deleted" : "";
        let disabled = post.isDeleted ? "disabled" : "";
        let restoreBtn = post.isDeleted ? `<button class="restore" onclick="RestorePost('${post.id}')">Restore</button>` : "";

        body.innerHTML += `
        <tr class="${cls}">
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td class="action-buttons">
                <button class="edit" onclick="EditPost('${post.id}')" ${disabled}>Edit</button>
                <button class="delete" onclick="SoftDeletePost('${post.id}')" ${disabled}>Delete</button>
                ${restoreBtn}
            </td>
        </tr>`;
    }
}

async function SavePost() {
    let id = document.getElementById("title_txt").getAttribute("data-id");
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    if (!title || !views) {
        alert("Please fill in all fields");
        return;
    }

    if (id) {
        // Update
        await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views })
        });
    } else {
        // Create
        let res = await fetch("http://localhost:3000/posts");
        let posts = await res.json();
        let maxId = posts.reduce((max, p) => Math.max(max, Number(p.id)), 0);
        let newId = (maxId + 1).toString();

        await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                title,
                views,
                isDeleted: false
            })
        });
    }

    document.getElementById("title_txt").removeAttribute("data-id");
    document.getElementById("title_txt").value = "";
    document.getElementById("view_txt").value = "";
    LoadPosts();
}

async function EditPost(id) {
    let res = await fetch(`http://localhost:3000/posts/${id}`);
    let post = await res.json();
    
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
    document.getElementById("title_txt").setAttribute("data-id", id);
}

async function SoftDeletePost(id) {
    await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    LoadPosts();
}

async function RestorePost(id) {
    await fetch(`http://localhost:3000/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });

    LoadPosts();
}

async function LoadComments() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();

    let body = document.getElementById("comment_table");
    body.innerHTML = "";

    for (let c of comments) {
        let cls = c.isDeleted ? "deleted" : "";
        let disabled = c.isDeleted ? "disabled" : "";
        let restoreBtn = c.isDeleted ? `<button class="restore" onclick="RestoreComment('${c.id}')">Restore</button>` : "";

        body.innerHTML += `
        <tr class="${cls}">
            <td>${c.id}</td>
            <td>${c.postId}</td>
            <td>${c.text}</td>
            <td class="action-buttons">
                <button class="edit" onclick="EditComment('${c.id}')" ${disabled}>Edit</button>
                <button class="delete" onclick="SoftDeleteComment('${c.id}')" ${disabled}>Delete</button>
                ${restoreBtn}
            </td>
        </tr>`;
    }
}

async function SaveComment() {
    let id = document.getElementById("comment_text").getAttribute("data-id");
    let postId = document.getElementById("comment_postId").value;
    let text = document.getElementById("comment_text").value;

    if (!postId || !text) {
        alert("Please fill in all fields");
        return;
    }

    if (id) {
        // Update
        await fetch(`http://localhost:3000/comments/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, text })
        });
    } else {
        // Create
        let res = await fetch("http://localhost:3000/comments");
        let comments = await res.json();
        let maxId = comments.reduce((m, c) => Math.max(m, Number(c.id)), 0);
        let newId = (maxId + 1).toString();

        await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: newId,
                postId,
                text,
                isDeleted: false
            })
        });
    }

    document.getElementById("comment_text").removeAttribute("data-id");
    document.getElementById("comment_postId").value = "";
    document.getElementById("comment_text").value = "";
    LoadComments();
}

async function EditComment(id) {
    let res = await fetch(`http://localhost:3000/comments/${id}`);
    let comment = await res.json();
    
    document.getElementById("comment_postId").value = comment.postId;
    document.getElementById("comment_text").value = comment.text;
    document.getElementById("comment_text").setAttribute("data-id", id);
}

async function SoftDeleteComment(id) {
    await fetch(`http://localhost:3000/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    LoadComments();
}

async function RestoreComment(id) {
    await fetch(`http://localhost:3000/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    });

    LoadComments();
}

LoadPosts();
LoadComments();
