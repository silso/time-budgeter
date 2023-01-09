<div><slot /></div>

<style lang="scss">
  @use '@material/typography';

  div {
    @include typography.typography('headline5');
  }
</style>
