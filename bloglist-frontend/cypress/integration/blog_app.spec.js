/* eslint-disable no-undef */
describe("PhoneBook app", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3001/api/testing/reset")
        const user = {
            username: "testingusername",
            password: "password",
            name: "testingname",
        }
        cy.request("POST", "http://localhost:3001/api/users/", user)
        cy.visit("http://localhost:3000")
    })

    it("Login form is shown", function () {
        cy.get("#loginTitle")
        cy.get("#usernameInput")
        cy.get("#passwordInput")
        cy.get("#loginSubmit")

    })

    describe("Login", function () {
        it("fails with wrong credentials", function () {
            cy.get("#usernameInput").type("wrongusername")
            cy.get("#passwordInput").type("password")
            cy.get("#loginSubmit").click()
            cy.get("#errorMessage").contains("Wrong credentials")
        })
        it("succeeds with correct credentials", function () {
            cy.get("#usernameInput").type("testingusername")
            cy.get("#passwordInput").type("password")
            cy.get("#loginSubmit").click()
        })
    })
    describe("When logged in", function () {
        beforeEach(function () {
            cy.request("POST", "http://localhost:3001/api/login", {
                username: "testingusername", password: "password"
            }).then(response => {
                localStorage.setItem("loggedBlogUser", JSON.stringify(response.body))
                cy.visit("http://localhost:3000")
            })
        })

        it("A blog can be created", function () {
            cy.get("#CreateNewBlog").click()
            cy.get("#Title").type("testTitle")
            cy.get("#Author").type("testAuthor")
            cy.get("#Url").type("testUrl")
            cy.get("#SubmitButton").click()

            cy.get(".list-group").children().should("have.length", 1)
            cy.get(".list-group-item").contains("testTitle").click()
            cy.get("#testTitle").contains("testTitle")
            cy.get("#testTitle").contains("testUrl")
            cy.get("#testTitle").contains("likes")
            cy.get("#testTitle").contains("testingusername")

        })

        it("Like a Blog", function () {
            cy.request({
                url: "http://localhost:3001/api/blogs",
                method: "POST",
                body: { title: "testTitle", author: "testAuthor", url: "testUrl" },
                headers: { "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedBlogUser")).token}` }
            })
            cy.get(".list-group-item").contains("testTitle").click()
            cy.get("#like").get("#likeButton").click()
            cy.get("#like").contains("likes 1")
        })

        it("Delete a Blog", function () {
            cy.request({
                url: "http://localhost:3001/api/blogs",
                method: "POST",
                body: { title: "testTitle", author: "testAuthor", url: "testUrl" },
                headers: { "Authorization": `bearer ${JSON.parse(localStorage.getItem("loggedBlogUser")).token}` }
            })
            cy.get(".list-group-item").contains("testTitle").click()
            cy.get("#remove").click()
            cy.get(".container").get(".list-group").should("not.exist")
        })

    })

})


