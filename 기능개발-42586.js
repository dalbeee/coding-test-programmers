"use strict";
const e = console.log;

/*

if 100일때 배포
날짜 중요x
tick 사용하기

0 93 30 55
1 94 60 60
2 95 90 65

DevSchedule{
    tickFromStart
    devModules : [
        DevModule {
            progresses
            speeds
            isDeploy    
        }
    ]
    tick(){}
    deploy(){}
    snapShot : {}
}

*/

class DevModule {
  static #counter = 0;

  constructor({ progresses, speeds }) {
    this.name = `name${this.getName()}`;
    this.progresses = progresses || 0;
    this.speeds = speeds || 0;
    this.isDeploy = progresses >= 100 ? true : false;
    this.isProgress = true;
  }

  getName() {
    return DevModule.#counter++;
  }
}

class DevSchedule {
  devModules = [];
  tickFromStart = 0;
  finishedTasks = [];
  #queue = [];

  constructor(input) {
    if (Array.isArray(input)) {
      input.forEach((i) => this.devModules.push(i));
    }
  }

  tick() {
    this.tickFromStart++;

    this.#queue.map((i) => {
      if (i.isProgress === false) return;
      i.progresses += i.speeds;
      if (i.progresses >= 100) {
        i.isProgress = false;
        i.progresses = 100;
      }
    });
  }

  get getDetail() {
    return this;
  }

  deploy() {
    if (this.#queue[0].progresses !== 100) return;
    const finishTask = [];
    const taskItemIndex = [];
    this.#queue.every((i, idx) => {
      if (i.progresses < 100) return false;

      i.isDeploy = true;
      taskItemIndex.push(idx);
      finishTask.push(i);
      return true;
    });

    if (taskItemIndex.length) {
      this.#queue.splice(0, taskItemIndex.length);
    }

    if (finishTask.length) {
      this.finishedTasks.push(finishTask);
    }
  }

  // main
  start() {
    this.#queue = this.devModules;

    while (this.#queue.some((i) => i.isProgress === true)) {
      this.tick();
      this.deploy();
      //   console.log(this.getDetail);
    }

    return this.finishedTasks;
  }
}

function solution(progresses, speeds) {
  const objectArray = [];
  for (let i = 0; progresses.length > i; i++) {
    const item = { progresses: progresses[i], speeds: speeds[i] };
    objectArray.push(item);
  }
  const devs = objectArray.map((i) => {
    return new DevModule({ progresses: i.progresses, speeds: i.speeds });
  });

  const schedule = new DevSchedule(devs);
  const result = schedule.start();

  return result.map((i) => i.length);
}

// e(solution([93, 30, 55], [1, 30, 5]));
e(solution([95, 90, 99, 99, 80, 99], [1, 1, 1, 1, 1, 1]));
