import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../viewmodels/task_viewmodel.dart';
import '../models/task.dart';

class TaskListView extends StatelessWidget {
  const TaskListView({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TaskViewModel>(
      builder: (context, vm, child) {
        if (vm.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        return Scaffold(
          appBar: AppBar(
            title: const Text('Mis Tareas'),
            backgroundColor: Colors.deepPurple,
          ),
          body: vm.tasks.isEmpty
              ? const Center(child: Text('No hay tareas'))
              : ListView.separated(
                  itemCount: vm.tasks.length,
                  separatorBuilder: (_, __) => const Divider(),
                  itemBuilder: (context, index) {
                    final task = vm.tasks[index];
                    return ListTile(
                      leading: Checkbox(
                        value: task.isDone,
                        onChanged: (_) => vm.toggleTaskDone(task.id),
                      ),
                      title: Text(
                        task.title,
                        style: TextStyle(
                          decoration: task.isDone
                              ? TextDecoration.lineThrough
                              : null,
                        ),
                      ),
                      subtitle: Text(task.description),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.edit, color: Colors.blue),
                            onPressed: () async {
                              final result = await Navigator.pushNamed(
                                context,
                                '/edit',
                                arguments: task,
                              );
                              if (result != null && result is Task) {
                                vm.updateTask(result);
                              }
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () => vm.deleteTask(task.id),
                          ),
                        ],
                      ),
                    );
                  },
                ),
          floatingActionButton: FloatingActionButton(
            onPressed: () async {
              final result = await Navigator.pushNamed(context, '/add');
              if (result != null && result is Task) {
                vm.addTask(result.title, result.description);
              }
            },
            backgroundColor: Colors.deepPurple,
            child: const Icon(Icons.add),
          ),
        );
      },
    );
  }
}
