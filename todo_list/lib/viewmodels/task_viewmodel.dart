import 'package:flutter/material.dart';
import '../models/task.dart';
import '../services/task_service.dart';
import 'package:uuid/uuid.dart';

class TaskViewModel extends ChangeNotifier {
  final TaskService _service = TaskService();
  List<Task> _tasks = [];
  bool _isLoading = true;

  List<Task> get tasks => _tasks;
  bool get isLoading => _isLoading;

  TaskViewModel() {
    loadTasks();
  }

  Future<void> loadTasks() async {
    _isLoading = true;
    notifyListeners();
    _tasks = await _service.loadTasks();
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addTask(String title, String description) async {
    final task = Task(
      id: const Uuid().v4(),
      title: title,
      description: description,
    );
    _tasks.add(task);
    await _service.saveTasks(_tasks);
    notifyListeners();
  }

  Future<void> updateTask(Task updatedTask) async {
    final index = _tasks.indexWhere((t) => t.id == updatedTask.id);
    if (index != -1) {
      _tasks[index] = updatedTask;
      await _service.saveTasks(_tasks);
      notifyListeners();
    }
  }

  Future<void> deleteTask(String id) async {
    _tasks.removeWhere((t) => t.id == id);
    await _service.saveTasks(_tasks);
    notifyListeners();
  }

  Future<void> toggleTaskDone(String id) async {
    final index = _tasks.indexWhere((t) => t.id == id);
    if (index != -1) {
      _tasks[index].isDone = !_tasks[index].isDone;
      await _service.saveTasks(_tasks);
      notifyListeners();
    }
  }
}
