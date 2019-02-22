import { MaterialFactory, RobotFactory } from "./factories";
import { TIMES, POSITION } from "./const";

abstract class BaseFooBar {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}

export class Foo extends BaseFooBar {}
export class Bar extends BaseFooBar {}
export class FooBar extends BaseFooBar {}

export interface RobotAction {
  move: Function;
  mine: Function;
  assemble: Function;
  sell: Function;
  buyRobot: Function;
}

export interface AssembleResult {
  success: number;
  rest: BaseFooBar;
}

export class Robot implements RobotAction {
  position = 0;

  constructor(private materialFactory: MaterialFactory) {}

  timeout(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if the robot is at the right position
   * If not, move the robot
   * @param pos
   */
  async checkPosition(pos: number): Promise<boolean> {
    if (this.position !== pos) {
      await this.move();
      this.position = pos;
    }

    return Promise.resolve(true);
  }

  /**
   * Move action
   */
  async move(): Promise<any> {
    await this.timeout(TIMES.MOVE);
  }

  /**
   * Robot mining sequence
   * @param type
   */
  async mine(type: number): Promise<Foo|Bar|null> {
    await this.checkPosition(POSITION.MINING);
    switch (type) {
      case 1:
        await this.timeout(TIMES.MINE_FOO);
        return this.materialFactory.createFoo();
      case 2:
        await this.timeout(TIMES.MINE_BAR);
        return this.materialFactory.createBar();
      default:
        return null;
    }
  }

  /**
   * Robot assemble sequence
   * @param foo
   * @param bar
   */
  async assemble(foo: Foo, bar: Bar): Promise<AssembleResult> {
    await this.checkPosition(POSITION.ASSEMBLING);
    await this.timeout(TIMES.ASSEMBLE);

    // Failed
    if (Math.random() < 0.4) {
      return {
        success: 0,
        rest: bar
      };
    } else {
      return {
        success: 1,
        rest: this.materialFactory.createFooBar(foo, bar)
      };
    }
  }

  /**
   * Sell robot sequence
   * @param foobars
   */
  async sell(foobars: FooBar[]): Promise<number> {
    await this.checkPosition(POSITION.SELL);
    await this.timeout(TIMES.SELL);

    return foobars.length;
  }

  /**
   * Buy robot sequence
   * @param robotFactory
   */
  async buyRobot(robotFactory: RobotFactory): Promise<Robot> {
    await this.checkPosition(POSITION.BUY);
    return Promise.resolve(robotFactory.create());
  }
}
