<div><slot></slot></div>

<style lang="scss">
    @use "@material/typography";

    div {
        @include typography.typography('headline4');
    }
</style>