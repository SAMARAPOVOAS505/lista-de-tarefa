package br.com.aulajava.backendtodo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.aulajava.backendtodo.model.Task;

@Repository
public interface TaskRepository extends JpaRepository <Task, Long> {
   
}
