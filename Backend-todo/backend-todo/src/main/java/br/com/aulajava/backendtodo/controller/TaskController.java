package br.com.aulajava.backendtodo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import br.com.aulajava.backendtodo.model.Task;
import br.com.aulajava.backendtodo.repository.TaskRepository;

@RestController
@RequestMapping("/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskRepository tasksRepository;

     // Endpoint para listar todas as tarefas (tasks)
    @GetMapping
    public ResponseEntity<List<Task>> listarTasks(){
        List<Task> connection =  tasksRepository.findAll();
        return ResponseEntity.ok(connection);
    }
    
    // Endpoint para buscar uma tarefa pelo ID
    @GetMapping("/id")
     public ResponseEntity<Task> buscarTasksPorId(@PathVariable Long id){
        Task task = tasksRepository.findById(id).orElse(null);
        if (task !=null) {
            return ResponseEntity.ok(task);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

        // Endpoint para adicionar uma nova tarefa
    @PostMapping
    public ResponseEntity<Task> adicionarTask(@RequestBody Task task){
        Task novaTask = tasksRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaTask);
    }
    // Endpoint para atualizar uma tarefa existente
    @PutMapping("/{id}")
    public ResponseEntity<Task> atualizarTasks(@PathVariable Long id, @RequestBody Task tasks) {
    Task tasksExistente = tasksRepository.findById(id).orElse(null);
            if (tasksExistente != null) {
                tasksExistente.setTitle(tasks.getTitle());
                tasksExistente.setCreate_at(tasks.getCreate_at());
                tasksExistente.setStatus(tasks.getStatus());
            

                tasksRepository.save(tasksExistente);
                return ResponseEntity.ok(tasksExistente);
        } else {
           return ResponseEntity.notFound().build();
        }
    }
    
    // Endpoint para excluir um produto pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirTasks(@PathVariable Long id) {
        Task tasksExistente = tasksRepository.findById(id).orElse(null);
        if (tasksExistente != null) {
            tasksRepository.delete(tasksExistente);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}