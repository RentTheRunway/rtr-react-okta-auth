export default interface IUseWhen {
    when: (fn: () => boolean) => boolean;
}