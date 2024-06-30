import CalendarsModel from '../models/Calendars.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import CalendarsService from '../services/Calendars.service.mjs';
import sendMail from '../services/cloud/maill.service.mjs';
import UsersService from '../services/Users.service.mjs';
import {
  calendarOwnerRequestHtml,
  calendarRequestAccept,
  calendarRequestHtml,
  calendarRequestReject,
} from '../config/email/calendar.mjs';
import CalendarsRepository from '../repositories/Calendars.repository.mjs';
import {formatFullTime} from '../helpers/format/formatTime.mjs';

class CalendarsController extends BaseCrudController {
  constructor() {
    super(CalendarsModel, CalendarsRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  query = async (req, res) => {
    const {
      user = {},
      query: {isSender: isUserAsSender, isReceiver: isUserAsReceiver, ...props},
    } = req;

    const {count, docs, pageInfo} = await CalendarsService.query({
      ...(isUserAsSender ? {senderId: user._id} : {}),
      ...(isUserAsReceiver ? {receiverId: user._id} : {}),
      ...props,
    });

    return res.status(200).json({
      success: true,
      data: docs,
      count,
      pageInfo,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  acceptOrReject = async (req, res) => {
    const {
      body: {isAccept},
      params: {id},
    } = req;

    const calendar = await CalendarsService.findOnePopulate(id, 'postId');
    if (!calendar) throw new Error('No calendar found');

    const emailConfig = {
      postId: calendar.postId?._id,
      title: calendar.postId?.title,
      startAt: formatFullTime(calendar.startAt),
    };

    const [updateCalendar] = await Promise.all([
      CalendarsService.updateOne(calendar._id, {isAccept}),
      sendMail({
        subject: 'Yêu cầu xem phòng',
        to: calendar.email,
        html: isAccept ? calendarRequestAccept(emailConfig) : calendarRequestReject(emailConfig),
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: updateCalendar,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOrUpdateOne = async (req, res) => {
    const {
      body: {email, receiverId, postId, startAt},
    } = req;

    const [existing, owner] = await Promise.all([
      CalendarsService.Repo.getByEmail(email, receiverId),
      UsersService.findOne(receiverId),
    ]);

    const [calendar] = await Promise.all([
      existing
        ? CalendarsService.updateOne(existing._id, req.body)
        : CalendarsService.createOne(req.body),
      sendMail({
        subject: `${existing ? 'Thay đổi yêu cầu' : 'Yêu cầu'} xem phòng`,
        to: email,
        html: calendarRequestHtml({postId, startAt: formatFullTime(startAt)}),
      }),
      sendMail({
        subject: `${existing ? 'Thay đổi yêu cầu' : 'Yêu cầu'} xem phòng của ${email}`,
        to: owner.email,
        html: calendarOwnerRequestHtml({
          email,
          postId,
          startAt: formatFullTime(startAt),
        }),
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: calendar,
    });
  };
}

export default new CalendarsController();
