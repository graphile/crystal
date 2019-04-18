const { gql } = require("graphile-utils");
const {
  createSchema,
  releaseSchema,
  skipLDSTests,
  liveTest,
  next,
  expectNoChange,
  resetDatabase,
} = require("../live_helpers.js");
const { transactionlessQuery } = require("../../helpers");

if (skipLDSTests) {
  test.skip("Skipping LDS tests", () => {});
} else {
  beforeEach(() => resetDatabase());
  beforeAll(() => createSchema());
  afterAll(() => releaseSchema());

  [true, false].forEach(simpleCollection => {
    describe(
      simpleCollection ? "simple collections" : "relay connections",
      () => {
        test("no filters", () =>
          liveTest(
            simpleCollection
              ? gql`
                  subscription {
                    allUsersList {
                      name
                    }
                  }
                `
              : gql`
                  subscription {
                    allUsers {
                      nodes {
                        name
                      }
                    }
                  }
                `,
            async (pgClient, getLatest) => {
              let data;
              let getNodes = () =>
                simpleCollection
                  ? data.data.allUsersList
                  : data.data.allUsers.nodes;

              data = await next(getLatest);
              expect(getNodes()).toHaveLength(0);

              await pgClient.query(
                "insert into live_test.users (name, favorite_color) values ($1, $2), ($3, $4)",
                ["Alice", "red", "Bob", "green"]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(2);

              await pgClient.query(
                "insert into live_test.users (name, favorite_color) values ($1, $2), ($3, $4)",
                ["Caroline", "red", "Dave", "blue"]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(4);
            }
          ));

        test("simple filter", () =>
          liveTest(
            simpleCollection
              ? gql`
                  subscription {
                    allUsersList(condition: { favoriteColor: "red" }) {
                      name
                    }
                  }
                `
              : gql`
                  subscription {
                    allUsers(condition: { favoriteColor: "red" }) {
                      nodes {
                        name
                      }
                    }
                  }
                `,
            async (pgClient, getLatest) => {
              let data;
              let getNodes = () =>
                simpleCollection
                  ? data.data.allUsersList
                  : data.data.allUsers.nodes;

              data = await next(getLatest);
              expect(getNodes()).toHaveLength(0);

              await pgClient.query(
                "insert into live_test.users (name, favorite_color) values ($1, $2), ($3, $4)",
                ["Alice", "red", "Bob", "green"]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes().map(n => n.name)).toEqual(["Alice"]);

              await pgClient.query(
                "insert into live_test.users (name, favorite_color) values ($1, $2)",
                ["Caroline", "blue"]
              );
              await expectNoChange(getLatest);
            }
          ));

        test("composite key", async () => {
          const {
            rows: [user],
          } = await transactionlessQuery(
            "insert into live_test.users(name) values($1) returning *",
            ["Stuart"]
          );

          const {
            rows: [todo],
          } = await transactionlessQuery(
            "insert into live_test.todos(user_id, task) values($1, $2) returning *",
            [user.id, "Write tests"]
          );

          await transactionlessQuery(
            "insert into live_test.todos_log(user_id, todo_id, action) values($1, $2, $3) returning *",
            [user.id, todo.id, "checked"]
          );

          await transactionlessQuery(
            "insert into live_test.todos_log_viewed(user_id, todo_id) values($1, $2) returning *",
            [user.id, todo.id]
          );

          await liveTest(
            simpleCollection
              ? gql`
                  subscription($todoId: Int!, $userId: Int!) {
                    log: todosLogByTodoIdAndUserId(
                      todoId: $todoId
                      userId: $userId
                    ) {
                      todosLogViewedsByUserIdAndTodoIdList {
                        viewedAt
                      }
                      action
                    }
                  }
                `
              : gql`
                  subscription($todoId: Int!, $userId: Int!) {
                    log: todosLogByTodoIdAndUserId(
                      todoId: $todoId
                      userId: $userId
                    ) {
                      todosLogViewedsByUserIdAndTodoId {
                        nodes {
                          viewedAt
                        }
                      }
                      action
                    }
                  }
                `,
            { userId: user.id, todoId: todo.id },
            async (pgClient, getLatest) => {
              let data;

              let getViewedAtNodes = () =>
                simpleCollection
                  ? data.data.log.todosLogViewedsByUserIdAndTodoIdList
                  : data.data.log.todosLogViewedsByUserIdAndTodoId.nodes;

              data = await next(getLatest);
              expect(data.data.log).toBeTruthy();
              expect(getViewedAtNodes()).toHaveLength(1);

              await pgClient.query(
                "insert into live_test.todos_log_viewed(user_id, todo_id) values($1, $2) returning *",
                [user.id, todo.id]
              );
              data = await next(getLatest);
              expect(data.data.log).toBeTruthy();
              expect(getViewedAtNodes()).toHaveLength(2);
            }
          );
        });

        test("backward relation change", async () => {
          const {
            rows: [user],
          } = await transactionlessQuery(
            "insert into live_test.users(name) values($1) returning *",
            ["Stuart"]
          );
          const {
            rows: [todo],
          } = await transactionlessQuery(
            "insert into live_test.todos(user_id, task) values($1, $2) returning *",
            [user.id, "Write tests"]
          );

          await liveTest(
            simpleCollection
              ? gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserIdList {
                        id
                        task
                        completed
                      }
                    }
                  }
                `
              : gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserId {
                        nodes {
                          id
                          task
                          completed
                        }
                      }
                    }
                  }
                `,
            { id: user.id },
            async (pgClient, getLatest) => {
              let data;
              let getNodes = () =>
                simpleCollection
                  ? data.data.user.todosByUserIdList
                  : data.data.user.todosByUserId.nodes;

              data = await next(getLatest);
              expect(data.data.user).toBeTruthy();
              expect(data.data.user.name).toEqual("Stuart");
              expect(data.data.user.id).toEqual(user.id);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes()[0].completed).toBe(false);

              await pgClient.query(
                "update live_test.todos set completed = true where id = $1",
                [todo.id]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes()[0].completed).toBe(true);

              await pgClient.query(
                "update live_test.todos set completed = false where id = $1",
                [todo.id]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes()[0].completed).toBe(false);
            }
          );
        });

        test("backward relation delete", async () => {
          const {
            rows: [user],
          } = await transactionlessQuery(
            "insert into live_test.users(name) values($1) returning *",
            ["Stuart"]
          );
          const {
            rows: [todo],
          } = await transactionlessQuery(
            "insert into live_test.todos(user_id, task) values($1, $2) returning *",
            [user.id, "Write tests"]
          );

          await liveTest(
            simpleCollection
              ? gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserIdList {
                        id
                        task
                        completed
                      }
                    }
                  }
                `
              : gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserId {
                        nodes {
                          id
                          task
                          completed
                        }
                      }
                    }
                  }
                `,
            { id: user.id },
            async (pgClient, getLatest) => {
              let data;
              let getNodes = () =>
                simpleCollection
                  ? data.data.user.todosByUserIdList
                  : data.data.user.todosByUserId.nodes;

              data = await next(getLatest);
              expect(data.data.user).toBeTruthy();
              expect(data.data.user.name).toEqual("Stuart");
              expect(data.data.user.id).toEqual(user.id);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes()[0].completed).toBe(false);

              await pgClient.query(
                "delete from live_test.todos where id = $1",
                [todo.id]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(0);
            }
          );
        });

        test("backward relation insert", async () => {
          const {
            rows: [user],
          } = await transactionlessQuery(
            "insert into live_test.users(name) values($1) returning *",
            ["Stuart"]
          );
          await transactionlessQuery(
            "insert into live_test.todos(user_id, task) values($1, $2) returning *",
            [user.id, "Write tests"]
          );

          await liveTest(
            simpleCollection
              ? gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserIdList {
                        id
                        task
                        completed
                      }
                    }
                  }
                `
              : gql`
                  subscription($id: Int!) {
                    user: userById(id: $id) {
                      id
                      name
                      todosByUserId {
                        nodes {
                          id
                          task
                          completed
                        }
                      }
                    }
                  }
                `,
            { id: user.id },
            async (pgClient, getLatest) => {
              let data;
              let getNodes = () =>
                simpleCollection
                  ? data.data.user.todosByUserIdList
                  : data.data.user.todosByUserId.nodes;

              data = await next(getLatest);
              expect(data.data.user).toBeTruthy();
              expect(data.data.user.name).toEqual("Stuart");
              expect(data.data.user.id).toEqual(user.id);
              expect(getNodes()).toHaveLength(1);
              expect(getNodes()[0].completed).toBe(false);

              await pgClient.query(
                "insert into live_test.todos (user_id, task) values ($1, $2)",
                [user.id, "Another Task"]
              );
              data = await next(getLatest);
              expect(getNodes()).toHaveLength(2);
            }
          );
        });
      }
    );
  });
}
