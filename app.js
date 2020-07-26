//Storage Controller Modül (kulanıcıdan aldığımız bilgileri tarayıcı belleğine aktaracağımız kısım.)

// -----------STORAGE CONTROLLER MODULE--------------

const StorageController = (function(){

    return{
        storeProduct : function(product){
            let products;
            if(localStorage.getItem('products')===null){
                products=[];
                products.push(product);
               
            }
            else{
                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }
            localStorage.setItem('products',JSON.stringify(products))
        },
        getProducts : function(){
            let products;
            if(localStorage.getItem('products')==null){
                products=[];
                return products;
            }
            else{
                products=JSON.parse(localStorage.getItem('prodcucts'));
                return products;
            }
            
        }
    }
})();


// ------------PRODUCT CONTROLLER MODULE-------------

// Product Controller  Modül (ürün bilgilerini control ettiğimiz modul) 
//const ProductController = ()()  bu yapıya efee deniyor.

const ProductController = (function(){

    // private
    const Product = function(id,name,price){
        this.id=id;
        this.name=name;
        this.price=price;
    }   

    // bu data bilgileri Veritabanından API üzerinden ya da harici bir json dosyasından gelebilir. Burada biz örnek olması açısından kendimiz oluşturduk.
    const data = {
        products :[],
        selectedProduct : null,
        totalPrice : 0

    }
     //public
    return{
            getProducts : function(){
                return data.products;
            },
            getData : function(){
                return data;
            },
            getProductById : function(id){
                let product = null;
                
                data.products.forEach(prd => {
                   
                    if(prd.id==id){
                        product=prd;                 
                        
                    }
                }); 
                
                return product;
            },
            setCurrentProduct:function(product){
                data.selectedProduct=product;
            },
            getCurrentProduct : function(){
                return data.selectedProduct
            },
            addProduct: function(name,price){
                let id;

                if(data.products.length>0){
                    id = data.products[data.products.length-1].id+1;

                }
                else{
                    id=0;
                }

                const newProduct = new Product(id,name,parseFloat(price));
                data.products.push(newProduct);
                return newProduct;
            },
            updateProduct : function(name,price){
                let product = null;

                data.products.forEach(function(prd){
                    if(prd.id==data.selectedProduct.id){
                        prd.name=name;
                        prd.price=parseFloat(price);
                        product=prd;
                    }
                })

                return product;
            },
            deleteProduct:function(product){
                data.products.forEach((prd,index)=>{
                    if(prd.id==product.id){
                        data.products.splice(index,1)
                    }
                })
            },
            getTotal : function(){
                let total=0;

                data.products.forEach(item => {
                    total+=item.price
                });

                data.totalPrice=total;
                return data.totalPrice;
            }
           
    }

})();

// ------------------UI CONTROLLER MODULE-----------

// UI Controller Modül (Bilgileri Kullanıcıya gösterece kolana ve HTML etiketleriyle etkleşimde bulunan modül)
const UIController=(function(){

    const Selectors = {
        productList : '#item-list',
        productListItems :'#item-list tr',
        addButton : '.addBtn',
        updateButton : '.updateBtn',
        cancelButton :'.cancelBtn',
        deleteButton : '.deleteBtn',
        productName : '#productName',
        productPrice : '#productPrice',
        productCard :'#productCard',
        totalTL :'#total-tl',
        totalDolar :'#total-dolar'
    }

    return {
        createProductList : function(products){
            let html=``

            products.forEach(prd => {
                html +=`
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                       
                            <i class="far fa-edit edit-product"></i>
                        
                    </td>
            </tr>
                `
            });

            document.querySelector(Selectors.productList).innerHTML=html;
        },
        getSelectors : function(){
            return Selectors;
        },
        addProduct : function(prd){
            document.querySelector(Selectors.productCard).style.display='block'
            var item =`
            <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        
                            <i class="far fa-edit edit-product"></i>
                        
                    </td>
            </tr>
            `
            document.querySelector(Selectors.productList).innerHTML+= item;
        },
        updateProduct : function(prd){
            let updatedItem = null;

                let items=document.querySelectorAll(Selectors.productListItems);
                items.forEach(item =>{
                    if(item.classList.contains('bg-warning')){
                        item.children[1].textContent=prd.name;
                        item.children[2].textContent=(prd.price)+' $';
                        updatedItem=item;
                    }
                })

            return updatedItem;
        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value='';
            document.querySelector(Selectors.productPrice).value='';

        },
        clearWarnings:function(){
           const items = document.querySelectorAll(Selectors.productListItems);
           items.forEach(item => {
            if(item.classList.contains('bg-warning')){
                item.classList.remove('bg-warning')
            }
           });
        },
        hideCard : function(){
            document.querySelector(Selectors.productCard).style.display='none'
        },
        showTotal :function(total){
            document.querySelector(Selectors.totalDolar).textContent=total;
            document.querySelector(Selectors.totalTL).textContent=total*7;
        },
        addProductToForm:function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value=selectedProduct.name;
            document.querySelector(Selectors.productPrice).value=selectedProduct.price;
        },
        deleteProduct:function(){
            let items =document.querySelectorAll(Selectors.productListItems);
            items.forEach(item => {
                if(item.classList.contains('bg-warning')){
                    item.remove();
                }
            });
        },
        addingState : function (){
            UIController.clearWarnings();
            
            UIController.clearInputs();

            

            document.querySelector(Selectors.addButton).style.display='inline';
            document.querySelector(Selectors.updateButton).style.display='none';
            document.querySelector(Selectors.deleteButton).style.display='none';
            document.querySelector(Selectors.cancelButton).style.display='none';
        },
        editState : function(tr){
            const parent =tr.parentNode;
            for(let i=0;i<parent.children.length;i++){
                parent.children[i].classList.remove('bg-warning');
            }
           

            tr.classList.add('bg-warning');
           
           
            document.querySelector(Selectors.addButton).style.display='none';
            document.querySelector(Selectors.updateButton).style.display='inline';
            document.querySelector(Selectors.deleteButton).style.display='inline';
            document.querySelector(Selectors.cancelButton).style.display='inline';

        }
    }
})();

// ------------------APP MODULE--------------------- 

// App Controller (Ana modül istediğimiz modulleri bu modülün içerisinde kullanacağız.)


const App=(function(ProductCtrl,UICtrl,StorageCtrl){

    const UISelectors = UICtrl.getSelectors();
    
    //Load Event Listener
    const loadEventListeners=function(){
        //Add product event
        document.querySelector(UISelectors.addButton).addEventListener('click',productAddSubmit);

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click',productEditClick);

        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click',editProductSubmit);

           //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click',cancelUpdate);

        document.querySelector(UISelectors.deleteButton).addEventListener('click',deleteProductSubmit);
           
    }



    const productAddSubmit=function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName!=='' && productPrice!==''){
            //add Product
            const newProduct =ProductController.addProduct(productName,productPrice);
            
            // add product to list
            UIController.addProduct(newProduct);

            //add product to Local Storage
            StorageCtrl.storeProduct(newProduct)
            // get total

            const total=ProductCtrl.getTotal();
            console.log("total "+ total)

            //show total
            UIController.showTotal(total);

            //Clear inputs
            UICtrl.clearInputs();

            
            
        }

        console.log(productName,productPrice)

        e.preventDefault();
    }

    const productEditClick= function(e){

        if(e.target.classList.contains('edit-product')){
            const id=e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
         

            // get selected product
           const product = ProductCtrl.getProductById(id);
           
           //set current product
           ProductCtrl.setCurrentProduct(product);

           //add product to UI
           UICtrl.addProductToForm();

           //show/hide buttons
           
           UICtrl.editState(e.target.parentNode.parentNode)
        }


        e.preventDefault();
    }

    const editProductSubmit=function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice!==''){

            // update product
            const updatedProduct= ProductCtrl.updateProduct(productName,productPrice);
            

            // update UI
           let item=  UICtrl.updateProduct(updatedProduct);
           
            
            // get total

            const total=ProductCtrl.getTotal();
            console.log("total "+ total)

            //show total
            UIController.showTotal(total);

            //clear inputs
            UICtrl.addingState(item);

            
        }
        e.preventDefault();
    }
    const cancelUpdate=function(e){
        
        UICtrl.addingState()
        e.preventDefault()
    }

    const deleteProductSubmit=function(e){
        // get selected product
        const selectedProduct=ProductCtrl.getCurrentProduct();

        //delete product
        ProductCtrl.deleteProduct(selectedProduct);
       
        //delete UI
        UICtrl.deleteProduct();

        // get total

        const total=ProductCtrl.getTotal();
        console.log("total "+ total)

        //show total
        UIController.showTotal(total);
        UICtrl.addingState();
        
        //hide card
        const products = ProductCtrl.getProducts();
           
           
        if(products.length==0){
            UICtrl.hideCard();
            
        }
        e.preventDefault()
    }
 

    return {
        init : function(){
            console.log('starting app ...');
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
           
           
            if(products.length==0){
                UICtrl.hideCard();
                
            }
            else{
                UICtrl.createProductList(products);
               
            }

            //get total
            const total=ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);            
             // load event listeners
            loadEventListeners();
        }
    }

})(ProductController,UIController,StorageController);

App.init();


