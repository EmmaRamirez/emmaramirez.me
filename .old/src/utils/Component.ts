export abstract class Component<P = {}> {
  constructor(public props: P) {
    this.props = props;
  }

  public abstract render(): string | null;
}
