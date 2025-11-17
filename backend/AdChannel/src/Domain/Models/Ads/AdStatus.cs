namespace AdChannel.Domain.Models.Ads
{
    public enum AdStatus
    {
        /// <summary>
        /// Реклама создана компанией (черновик)
        /// </summary>
        Created = 0,

        /// <summary>
        /// Канал взял рекламу — она в очереди на публикацию
        /// </summary>
        InQueue = 1,

        /// <summary>
        /// Реклама опубликована и доступна для выбора каналами
        /// </summary>
        Published = 2,
    }
}
