namespace AdChannel.Domain.Models.Ads
{
    namespace AdChannel.Domain.Models.Ads
    {
        public enum AdPostStatus
        {
            /// <summary>
            /// Реклама создана компанией и доступна для выбора каналами
            /// </summary>
            Available = 0,

            /// <summary>
            /// Канал взял рекламу — она в очереди на публикацию
            /// </summary>
            InQueue = 1,

            /// <summary>
            /// Реклама опубликована в канале
            /// </summary>
            Published = 2,
        }
    }
}
