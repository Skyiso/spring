package com.vimpel.kaftan.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.vimpel.kaftan.domain.Client;
import com.vimpel.kaftan.domain.Views;
import com.vimpel.kaftan.repo.ClientRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("client")
public class ClientController {
    private final ClientRepo clientRepo;

    @Autowired
    public ClientController(ClientRepo clientRepo) {
        this.clientRepo = clientRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<Client> list() {
        return clientRepo.findAll();
    }

    @GetMapping("{id}")
    @JsonView(Views.FullClient.class)
    public Client getOne(@PathVariable("id") Client client) {
        return client;
    }

    @PostMapping
    public Client create(@Validated @RequestBody Client client) {
        client.setCreationDate(LocalDateTime.now());
        return clientRepo.save(client);
    }

    @PutMapping("{id}")
    public Client update(
            @PathVariable("id") Client clientFromDb,
            @Validated @RequestBody Client client
    ) {
        BeanUtils.copyProperties(client, clientFromDb, "id");

        return clientRepo.save(clientFromDb);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Client client) {
        clientRepo.delete(client);
    }
}