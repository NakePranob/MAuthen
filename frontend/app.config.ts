export default defineAppConfig({
    ui: {
      primary: 'primary-app',
      gray: 'zinc',
      notifications: {
        // Show toasts at the top right of the screen
        position: 'xl:top-[unset] xl:bottom-0 xl:right-0 right-0 top-0 bottom-[unset]'
      },
      input: {
        default: {
          rounded: `rounded-[8px]`,
        }
      },
    }
  })