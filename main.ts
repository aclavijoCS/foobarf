/**
 * foobarfactory exercice
 */
import { MATERIAL_TYPE } from './const';
import { RobotFactory } from './factories';
import { Foo, Bar, FooBar, Robot, AssembleResult } from './models';


interface MaterialContainer {
    foo: Foo[];
    bar: Bar[];
    foobar: FooBar[];
}

class FooBarAlg {
    private money = 0;
    private generalStatus = {
        isRobotBuying: 0,
        isRobotSelling: 0,
        numberSellers: 0,
        numberBuyers: 0
    };
    private robotContainer: Robot[] = [];
    private materialsContainer: MaterialContainer = {
        foo: [],
        bar: [],
        foobar: []
    };

    constructor() {
        this.initialize();
    }

    initialize() {
        const robotFactory = RobotFactory.getInstance();
        this.robotContainer.push(robotFactory.create());
        this.robotContainer.push(robotFactory.create());
    }

    async main() {
        console.time('timer');
        while (this.robotContainer.length < 100) {
            this.computeNumberSellersBuyersMax();
            this.loggingInfo();
            let tasks: Promise<any>[] = [];
            tasks = this.robotContainer.map(async (r: Robot) => this.choice(r));
            const res = await Promise.all(tasks);
            this.reinit();
        }
        console.timeEnd('timer');
    }

    async choice(r: Robot): Promise<any> {
        let m;
        // make money
        if (this.money >= 3 && this.materialsContainer.foo.length > 6 && this.generalStatus.isRobotSelling < this.generalStatus.numberBuyers) {
            this.generalStatus.isRobotSelling += 1;
            const robot = await r.buyRobot(RobotFactory.getInstance());
            this.robotContainer = [...this.robotContainer, robot];
            this.money = this.money - 3;
            this.materialsContainer.foo.splice(0, 6);

            return Promise.resolve(true);
        }
        // sell foobar
        if (this.materialsContainer.foobar.length >= 3 && this.generalStatus.isRobotSelling < this.generalStatus.numberSellers) {
            this.generalStatus.isRobotSelling += 1;
            let ngFB = this.materialsContainer.foobar.length;
            if (ngFB > 5) {
                ngFB = 5;
            }
            m = await r.sell(this.materialsContainer.foobar.splice(0, ngFB));
            this.money += m;

            return Promise.resolve(true);
        } 
        // Create FooBar
        if (this.materialsContainer.foo.length >= 2 && this.materialsContainer.bar.length >= 2) {
            const foo = this.materialsContainer.foo.splice(0, 1)[0];
            const bar = this.materialsContainer.bar.splice(0, 1)[0];
            m = <AssembleResult>await r.assemble(foo, bar);
            if (m.success) {
                this.materialsContainer.foobar.push(<FooBar>m.rest);
            } else {
                this.materialsContainer.bar.push(<Bar>m.rest);
            }
            
            return Promise.resolve(true);
        }
        // Mine
        if (this.materialsContainer.foo.length <= this.materialsContainer.bar.length || this.money >= 3) {
            m = <Foo>await r.mine(MATERIAL_TYPE.FOO);
            this.materialsContainer.foo.push(m);
            return Promise.resolve(true);
        } else {
            m = <Bar>await r.mine(MATERIAL_TYPE.BAR);
            this.materialsContainer.bar.push(m);
            return Promise.resolve(true);
        }
    }

    computeNumberSellersBuyersMax(): void {
        // Compute number Sellers
        const nb = Math.floor(this.materialsContainer.foobar.length / 5);
        this.generalStatus.numberSellers = (nb < 1) ? 1 : nb; 

        // Compute number buyers
        const nbM = Math.floor(this.money/3);
        const nbF = Math.floor(this.materialsContainer.foo.length/6);
        this.generalStatus.numberBuyers = (nbM >= nbF)? nbF : nbM;
    }

    reinit(): void {
        this.generalStatus.isRobotBuying  = 0;
        this.generalStatus.isRobotSelling = 0;
        this.generalStatus.numberBuyers   = 0;
        this.generalStatus.numberSellers  = 0;
    }

    loggingInfo(): void {
        console.clear();
        console.log(`
            [Robots]: ${this.robotContainer.length}, [Money]: ${this.money}, [Nb Sellers Max]: ${this.generalStatus.numberSellers}, [Nb Buyer(s) Max]: ${this.generalStatus.numberBuyers} \n
            [Mateials]: Foo: ${this.materialsContainer.foo.length}, Bar: ${this.materialsContainer.bar.length}, FooBar: ${this.materialsContainer.foobar.length}
        `);
    }
}

const foobarFactory = new FooBarAlg();
foobarFactory.main();


