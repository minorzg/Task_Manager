from fastapi import FastAPI
from database import tasks_collection
from schemas import TaskCreate
from bson import ObjectId
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



@app.get("/tasks")
def get_tasks():
    tasks = list(tasks_collection.find())

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks



@app.post("/tasks")
def create_task(task: TaskCreate):
    new_task = task.model_dump()

    result = tasks_collection.insert_one(new_task)

    return {
        "message": "Task created successfully",
        "id": str(result.inserted_id)
    }




@app.patch("/tasks/{task_id}")
def complete_task(task_id: str):

    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"completed": True}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {"message": "Task completed successfully"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):

    result = tasks_collection.delete_one(
        {"_id": ObjectId(task_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return {"message": "Task deleted successfully"}