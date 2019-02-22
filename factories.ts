import { Foo, Bar, FooBar, Robot } from './models';

export class RobotFactory {
    private static instance: RobotFactory;
    private constructor () {}

    static getInstance(): RobotFactory {
        if (!RobotFactory.instance) {
            RobotFactory.instance = new RobotFactory();
        }

        return RobotFactory.instance;
    }

    create(): Robot {
        return new Robot(MaterialFactory.getInstance());
    }
}


export class MaterialFactory {
    private static instance: MaterialFactory;
    private constructor() {}
    
    static getInstance(): MaterialFactory {
        if (!MaterialFactory.instance) {
            MaterialFactory.instance = new MaterialFactory();
        }

        return MaterialFactory.instance;
    }

    private generateUniqueId(): string {
        return Math.random().toString(36).substring(2) 
               + (new Date()).getTime().toString(36);

    }

    createFoo(): Foo {
        return new Foo(this.generateUniqueId());
    }

    createBar() {
        return new Bar(this.generateUniqueId());
    }

    createFooBar(foo: Foo, bar: Bar): FooBar {
        return new FooBar(foo.getId() + bar.getId());
    }
}