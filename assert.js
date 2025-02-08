function assert(condition) {
    if (!condition) {
        console.group('An assertion has failed.')
        for (var i = 1; i < arguments.length; i++) {
            console.warn(arguments[i]);
        }
        console.groupEnd()
    }
    return condition
};