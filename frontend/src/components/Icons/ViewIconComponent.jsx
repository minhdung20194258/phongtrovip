import {
  IconCart,
  IconCheck,
  IconChevron,
  IconClose,
  IconCricleCheck,
  IconCricleInfo,
  IconCricleQuestion,
  IconCricleXmark,
  IconEye,
  IconEyeSlash,
  IconFacbebook,
  IconGoogle,
  IconUnlock,
  IconTriangle,
  IconMenu,
  IconUser,
  IconStar,
  IconCamera,
  IconTrash,
  IconAdd,
  IconPen,
  IconStarBold,
  IconMap,
  IconTime,
  IconChevronDouble,
  IconSearchFilled,
  IconFlash,
  IconLove,
  IconBookMark,
  IconBookMarkSlim,
  IconLoveSlim,
  IconHome,
  IconDislike,
  IconDislikeSlim,
  IconMessageRoom,
  IconSend,
  IconReply,
  IconPiggyBank,
  IconBadgePlan,
  IconApartment,
  IconHomeSlim,
  IconStore,
  IconWork,
  IconDoor,
  IconUpload,
  IconEdit,
  IconDisabled,
  IconVerify,
  IconFlag,
  IconLock,
  IconKey,
  IconDola,
  IconRefund,
  IconImage,
} from '@/components/Icons/AppIcon.jsx';

function ViewIconComponent() {
  return (
    <div className={'w-full'}>
      <div className={'row p-100'}>
        <div className="col-3">
          <div>IconDola</div>
          <IconDola />
          <div>IconImage</div>
          <IconImage />
          <div>IconRefund</div>
          <IconRefund />
        </div>

        <div className="col-3">
          <div>IconStore</div>
          <IconStore />
          <div>IconKey</div>
          <IconKey />
          <div>IconUpload</div>
          <IconUpload />
          <div>IconDoor</div>
          <IconDoor />
          <div>IconWork</div>
          <IconWork />
          <div>IconHomeSlim</div>
          <IconHomeSlim />
          <div>IconApartment</div>
          <IconApartment />
          <div>IconPiggyBank</div>
          <IconPiggyBank />
          <div>IconBadgePlan</div>
          <IconBadgePlan />
          <div>IconReply</div>
          <IconReply />
          <div>IconVerify</div>
          <IconVerify />
          <div>IconFlag</div>
          <IconFlag />
        </div>
        <div className="col-3">
          <div>IconChevronDouble</div>
          <IconChevronDouble />
          <div>IconSearchFilled</div>
          <IconSearchFilled />
          <div>IconFlash</div>
          <IconFlash />
          <div>IconLove</div>
          <IconLove />
          <div>IconLoveSlim</div>
          <IconLoveSlim />
          <div>IconBookMark</div>
          <IconBookMark />
          <div>IconBookMarkSlim</div>
          <IconBookMarkSlim />
          <div>IconDislike</div>
          <IconDislike />
          <div>IconDislikeSlim</div>
          <IconDislikeSlim />
          <div>IconHome</div>
          <IconHome />
          <div>IconMessageRoom</div>
          <IconMessageRoom />
          <div>IconSend</div>
          <IconSend />
        </div>
        <div className="col-3">
          <div>IconUser</div>
          <IconUser />
          <div>IconStar</div>
          <IconStar />
          <div>IconCamera</div>
          <IconCamera />
          <div>IconTrash</div>
          <IconTrash />
          <div>IconAdd</div>
          <IconAdd />
          <div>IconPen</div>
          <IconPen />
          <div>IconEdit</div>
          <IconEdit />
          <div>IconStarBold</div>
          <IconStarBold />
          <div>IconMap</div>
          <IconMap />
          <div>IconTime</div>
          <IconTime />
          <div>IconDisabled</div>
          <IconDisabled />
        </div>

        <div className="col-3">
          <div>IconChevron type:up default</div>
          <IconChevron type={'up'} />

          <div>IconChevron type:down</div>
          <IconChevron type={'down'} />

          <div>IconChevron type:next</div>
          <IconChevron type={'next'} />

          <div>IconChevron type:prev</div>
          <IconChevron type={'prev'} />
        </div>
        <div className="col-3">
          <div>IconTriangle</div>
          {IconTriangle()}
          <div>IconCricleXmark</div>
          {IconCricleXmark()}
          <div>IconCricleQuestion</div>
          {IconCricleQuestion()}
          <div>IconCricleInfo</div>
          {IconCricleInfo()}
          <div>IconUnlock</div>
          {IconUnlock()}
          <div>IconLock</div>
          {IconLock()}
          <div>IconMenu</div>
          {IconMenu()}
        </div>
        <div className="col-3">
          <div>IconGoogle</div>
          {IconGoogle()}

          <div>IconFacbebook</div>
          {IconFacbebook()}

          <div>IconCheck</div>
          {IconCheck()}

          <div>IconCart</div>
          {IconCart()}

          <div>IconEyeSlash</div>
          {IconEyeSlash()}

          <div>IconEye</div>
          {IconEye()}

          <div>IconClose</div>
          {IconClose()}

          <div>IconCricleCheck</div>
          {IconCricleCheck()}
        </div>
      </div>
    </div>
  );
}

export default ViewIconComponent;
