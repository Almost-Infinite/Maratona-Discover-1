const btOpenIn = document.querySelector(".button.new.in")
const btOpenOut = document.querySelector(".button.new.out")

const btCloseIn = document.querySelector(".button.cancel.in")
const btCloseOut = document.querySelector(".button.cancel.out")

const modalOverlayIn = document.querySelector(".modal-overlay.in")
const modalOverlayOut = document.querySelector(".modal-overlay.out")


//import ale from "./test.js"


// ===================== Abrir Modals =========================
const modalIn = {
    open() {
        // Abrir Modal
        // Adicionar a class active ao Modal        
        modalOverlayIn.classList.add("active")
    },
    close() {
        // Fechar Modal
        // Remover a class active ao Modal        
        modalOverlayIn.classList.remove("active")
    }
}

btOpenIn.addEventListener('click', () => {


    modalIn.open()

})
btCloseIn.addEventListener('click', () => {

    modalIn.close()
})

const modalOut = {
    open() {
        // Abrir Modal
        // Adicionar a class active ao Modal        
        modalOverlayOut.classList.add("active")
    },
    close() {
        // Fechar Modal
        // Remover a class active ao Modal        
        modalOverlayOut.classList.remove("active")
    }
}

btOpenOut.addEventListener('click', () => {


    modalOut.open()

})
btCloseOut.addEventListener('click', () => {

    modalOut.close()
})
// ======================================================================

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transactions = {
    all: Storage.get(),
    add(transaction) {
        Transactions.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transactions.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        let income = 0
        Transactions.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount

            }
        })

        return income
    },

    expenses() {
        let expense = 0
        Transactions.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount

            }
        })

        return expense
    },

    total() {
        return Transactions.incomes() + Transactions.expenses()
    }
}
const Utils = {
    formatAmount(value) {
        value = modalOverlayIn.classList.contains("active") ? Number(value) * 100 : Number(value) * 100 * (-1)

        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "- " : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString('pt-BR', {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),
    IMG: document.querySelector("#transaction > img"),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)


    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `            
                <td class="description">${transaction.description}</td>
                    <td class="${CSSclass}">${amount}</td>
                    <td class="date">${transaction.date}</td>
                <td>
                    <img onclick=Transactions.remove(${index}) src="./assets/minus.svg" title="Remover Transação" alt="Remover Transação">
                </td>
            </tr>
        `

        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transactions.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transactions.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transactions.total())
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = ""
    },

}


const App = {
    init() {
        Transactions.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)


        })

        DOM.updateBalance()

        Storage.set(Transactions.all)

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

const Form = {
    classLen() {
        //debugger

        if (modalOverlayIn.classList.contains("active")) {

            return {
                description: document.querySelector("#formIn  input#description").value,
                amount: document.querySelector("#formIn  input#amount").value,
                date: document.querySelector("#formIn  input#date").value
            }
        } else if (modalOverlayOut.classList.contains("active")) {
            return {
                description: document.querySelector("#formOut  input#description").value,
                amount: document.querySelector("#formOut  input#amount").value,
                date: document.querySelector("#formOut  input#date").value
            }
        }
    },

    dados: {
        formIn: document.querySelector("#formIn"),
        formOut: document.querySelector("#formOut")

    },

    formatValues() {
        //let { description, amount, date } = Form.getValues()
        let { description, amount, date } = Form.classLen()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },


    validateFields() {
        //const { description, amount, date } = Form.getValues()
        const { description, amount, date } = Form.classLen()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!")
        }


    },
    saveTransaction(transaction) {
        Transactions.add(transaction)
    },
    clearFields() {
        
        
        modalOverlayIn.classList.contains("active") ? document.querySelector("#formIn #description").value = "" : document.querySelector("#formOut #description").value = ""
        modalOverlayIn.classList.contains("active") ? document.querySelector("#formIn #amount").value = "" : document.querySelector("#formOut #amount").value = ""
        modalOverlayIn.classList.contains("active") ? document.querySelector("#formIn #date").value = "" : document.querySelector("#formOut #date").value = ""
        
    },
    submit(event) {
        event.preventDefault()
        try {

            // Validar Dados            
            Form.validateFields()
            // Formatar dados
            const transaction = Form.formatValues()
            // Salvar dados
            Form.saveTransaction(transaction)
            // Apagar dados
            Form.clearFields()
            // Fechar modal            
            modalOverlayIn.classList.contains("active") ? modalIn.close() : modalOut.close()





        } catch (error) {

            alert(error.message)

        }

    }
}
Form.dados.formIn.addEventListener("submit", Form.submit)
Form.dados.formOut.addEventListener("submit", Form.submit)




App.init()


