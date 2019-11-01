class UserController{
    constructor(formId, tableId){
        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
    }
    onSubmit(){
        this.formEl.addEventListener("submit",(event)=>{
            event.preventDefault();
            const values = this.getValues();
            this.getPhoto().then((content) =>{
                values.photo = content;
                this.addLine(values);
            }).catch((err)=>{
                console.error(err);
            });
        });
    }
    getPhoto(){
        return new Promise((res, rej)=>{
            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter(item=>{
                if(item.name === "photo"){
                    return item;
                }
            });
            let file = elements[0].files[0];
            fileReader.onload = ()=>{
                res(fileReader.result);
            };
            fileReader.onerror = (e)=>{
                rej(e);
            };
            if(file){
                fileReader.readAsDataURL(file);
            }
            res('dist/img/default-50x50.gif');
        });
    }
    getValues(){
        const user = {};
        [...this.formEl.elements].forEach((field)=>{
            if (field.name == "gender") {
                if (field.checked) {
                    user[field.name] = field.value;
                }
            }else if(field.name == "admin"){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
        });
        return new User(
            user.name, 
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );
    }
    addLine(dataUser) {
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <tr>
          <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
          <td>${dataUser.name}</td>
          <td>${dataUser.email}</td>
          <td>${(dataUser.admin)?"Sim":"Não"}</td>
          <td>${dataUser.birth}</td>
          <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
          </td>
        </tr>`;
        this.tableEl.appendChild(tr);
    }
}