
function getIndex(list, id) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return i;
        }
    }

    return -1;
}

var clientApi = Vue.resource('/client{/id}');

Vue.component('client-form', {
  props: ['clients', 'clientAttr'],
  data: function(){
    return {
        name: '',
        age: '',
        email: '',
        id: ''
    }
  },
  watch: {
    clientAttr: function(newVal, oldVal) {
        this.name = newVal.name;
        this.age = newVal.age;
        this.email = newVal.email;
        this.id = newVal.id;
    }
  },
  template:
      '<div class="form-group">' +
           '<input type="text" placeholder="Write name" v-model="name" />' +
           '<input type="text" placeholder="Write age" v-model="age" />' +
           '<input type="email" placeholder="Write email" v-model="email" />' +
           '<input type="button" value="Save" @click="save" />' +
      '</div>',
  methods: {
    save: function() {
        var client = { age: this.age, name: this.name, email: this.email};

        if (this.id) {
            clientApi.update({id: this.id}, client).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.clients, data.id);
                    this.clients.splice(index, 1, data);
                    this.name = '';
                    this.age = '';
                    this.email = '';
                    this.id = ''
                })
            )
        } else {
            clientApi.save({}, client).then(result =>
                result.json().then(data => {
                    this.clients.push(data);
                    this.name = '';
                    this.age = '';
                    this.email = ''
                })
            )
         }
     }
  }
});

Vue.component('client-row', {
  props: ['client', 'editMethod', 'clients'],
  template: '<div>' +
        '<i>{{ client.id }}</i> {{ client.name }} {{ client.age }} {{ client.email }}' +
        '<span style="position: absolute; right: 0;" >' +
            '<input type="button" value="Edit" @click="edit" />' +
            '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
  methods: {
    edit: function() {
        this.editMethod(this.client);
    },
    del: function() {
        clientApi.remove({id: this.client.id}).then(result => {
            if (result.ok) {
                this.clients.splice(this.clients.indexOf(this.client), 1)
            }
        })
    }
  }
});

Vue.component('clients-list', {
  props: ['clients'],
  data: function() {
    return {
        client: null
    }
  },
  template:
    '<div style="position: relative; width: 300px;">' +
        '<client-form :clients="clients" :clientAttr="client" />' +
        '<client-row v-for="client in clients" :key="client.id" :client="client" ' +
        ':editMethod="editMethod" :clients="clients" />' +
    '</div>',
  created: function() {
    clientApi.get().then(result =>
        result.json().then(data =>
            data.forEach(client => this.clients.push(client))
            )
    )
  },
  methods: {
    editMethod: function(client) {
        this.client = client;
    }
  }
});

var app = new Vue({
  el: '#app',
  template: '<clients-list :clients="clients"/>',
  data: {
    clients: []
  }
});