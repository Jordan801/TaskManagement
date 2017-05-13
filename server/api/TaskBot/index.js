"use strict";

require("dotenv").config({path: '../../../.env'});

const slack = require("slack");
const bot = slack.rtm.client();

class TaskList {
   constructor(){
      this.list = [];
   }

   add (newTask) {
      this.list.push(newTask);
   }

   tasks(){
      return this.list.join(", ")
   }
}

const list = new TaskList();

bot.message((msg) => {

   if(msg.text.includes("!task")){

       const task = msg.text.replace("!task ", "");

       const responseMessage = `Your task "${task}" has been added to the task list at ${new Date()}`;

       list.add(task);

       slack.chat.postMessage({token: process.env.SLACK_BOT_TOKEN, channel: msg.channel, text: responseMessage}, (err, data) => {
          if(err){
             throw err;
          }

          console.log(data)
       })
   }

   if(msg.text.includes("!list")){

       slack.chat.postMessage({token: process.env.SLACK_BOT_TOKEN, channel: msg.channel, text: list.tasks()}, (err, data) => {
           if(err){
               throw err;
           }

           console.log(data)
       })

   }
});

bot.listen({token: process.env.SLACK_BOT_TOKEN});