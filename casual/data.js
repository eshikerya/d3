var data = {
	"tasks": [
		{
			"id": "1",
			"name": "task1",
			"type": "Task",
			"status": "Unblocked",
			"colId": 10,
			"rowId": 1
		},
		{
			"id": "2",
			"name": "task2",
			"type": "Task",
			"status": "Unblocked",
			"colId": 9,
			"rowId": 2
		},
		{
			"id": "3",
			"name": "task3",
			"type": "Task",
			"status": "Unblocked",
			"colId": 11,
			"rowId": 2
		},
		{
			"id": "4",
			"name": "task4",
			"type": "Task",
			"status": "Unblocked",
			"colId": 9,
			"rowId": 3
		},
		{
			"id": "5",
			"name": "task5<br />new line",
			"type": "Task",
			"status": "Unblocked",
			"colId": 10,
			"rowId": 4
		},
		{
			"id": "6",
			"name": "task6",
			"type": "Task",
			"status": "Unblocked",
			"colId": 11,
			"rowId": 3
		}
	],
	"transitions": [
		{
			"source": "1",
			"target": "2",
			"id": "t1"
		},
		{
			"source": "1",
			"target": "3",
			"id": "t2"
		},
		{
			"source": "2",
			"target": "4",
			"id": "t3"
		},
		{
			"source": "3",
			"target": "4",
			"id": "t4"
		},
		{
			"source": "4",
			"target": "5",
			"id": "t5"
		},
		{
			"source": "5",
			"target": "6",
			"id": "t6"
		}
	]
};