import { Application } from "@/models/application";
import { UserDocument } from "@/models/document";
import { APPLICATION_STATUS } from "@/types/enums/enums";
import { getObjectId } from "@/utils/helpers/commonHelpers";
import { UpdateApplication } from "@/utils/zod/application";

export class ApplicationService {
  static async createApplication(userId: string) {
    return Application.create({ userId });
  }

  static async getApplications(userId: string) {
    return Application.find({ userId });
  }

  static async getApplicationById(applicationId: string, userId: string) {
    const results = await Application.aggregate([
      {
        $match: {
          _id: getObjectId(applicationId),
          userId: getObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "userdocuments",
          let: { appId: "$_id", uId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$applicationId", "$$appId"] },
                    { $eq: ["$userId", "$$uId"] },
                  ],
                },
              },
            },

            {
              $project: {
                id: "$_id",
                _id: 0,
                type: 1,
                originalName: 1,
                size: 1,
              },
            },
          ],
          as: "documents",
        },
      },
    ]);

    if (!results || results.length === 0) {
      return null;
    }

    const applicationData = results[0];

    const { documents, ...application } = applicationData;

    return {
      application,
      documents,
    };
  }

  static async updateApplication(
    applicationId: string,
    userId: string,
    data: UpdateApplication,
  ) {
    return Application.findOneAndUpdate(
      {
        _id: applicationId,
        userId,
        status: APPLICATION_STATUS.DRAFT,
      },
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
}
