const e = console.log;

class PrinterQueue {
  #queue = [];
  #finished = [];

  // Doc 객체를 넣는다
  constructor(inputDoc) {
    if (Array.isArray(inputDoc)) {
      inputDoc.forEach((i) => {
        if (!(i instanceof Doc)) {
          throw Error("input Doc instance");
        }
        this.#queue.push(i);
      });
    }
  }

  get getQueue() {
    return this.#queue;
  }

  get getFinished() {
    return this.#finished;
  }

  get getTraceDoc() {
    return this.#finished.filter((i) => {
      return i.trace === "yes";
    })[0].finishedNumber;
  }

  // 우선 순위로 정렬
  sortByPriority() {
    while (this.#queue.some((i) => i.priorities > this.#queue[0].priorities)) {
      const temp = this.#queue[0];
      this.#queue.splice(0, 1);
      this.#queue.push(temp);
    }
  }

  // 맨 앞 문서 프린트
  print(finishedNumber) {
    const result = { ...this.#queue[0], finished: "ok", finishedNumber };

    this.#finished.push(result);
    this.#queue.splice(0, 1);
  }

  // 프린터 작업 시작
  start() {
    let printNumber = 0;
    while (!!this.#queue.length) {
      printNumber++;
      this.sortByPriority();
      this.print(printNumber);
    }
    console.log(`작업 결과 : `, this.getFinished);
  }
}

class Doc {
  name;
  priorities;
  trace;

  constructor(input) {
    if (typeof input === "number") {
      this.priorities = input;
    } else {
      for (const [key, value] of Object.entries(input)) {
        this[key] = value;
      }
    }
    this.name = this.name || "unknown";
    this.trace = this.trace || "no";
    this.priorities = this.priorities || 0;
  }

  get props() {
    return this;
  }
}

function solution(priorities, location) {
  const objects = priorities.map((i) => {
    return new Doc(i);
  });
  const queue = new PrinterQueue(objects);
  objects[location].trace = "yes";

  queue.start();
  return queue.getTraceDoc;
}

e(solution([2, 1, 3, 2], 2));

// const n1 = new Doc({ name: "a", priorities: 2 });
// const n2 = new Doc({ name: "b", priorities: 1 });
// const n3 = new Doc({ name: "c", priorities: 3 });
// const n4 = new Doc({ name: "d", priorities: 2 });
// const p = new PrinterQueue([n1, n2, n3, new Doc(7), new Doc({ trace: "yes" })]);

// p.start();
