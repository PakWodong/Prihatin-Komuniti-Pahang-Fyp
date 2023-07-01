
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import VolunteerActivitySerializer, VolunteerParticipantSerializer, getVolunteerParticipantSerializer
from .models import VolunteerActivityImage, VolunteerActivity, VolunteerParticipant
from botocore.exceptions import BotoCoreError, ClientError
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
import boto3
import uuid
import base64
from django.core.files.base import ContentFile
from django.db.models import ProtectedError


class VolunteerActivityView(APIView):# to use restful API class to get the data

    def get(self, request):#to get all the volunteer activity from the database
        activities = VolunteerActivity.objects.all()
        activity_serializer = VolunteerActivitySerializer(
            activities, many=True)#use serializer class to get data from model
        response_data = activity_serializer.data

        for activity in response_data:  #check each activity
            activity_id = activity['id']
            participants_count = VolunteerParticipant.objects.filter( #check volunteer participant for volunteer activity
                activity_id=activity_id).count()
            activity['num_participants'] = participants_count #assign the number of participant
            images = VolunteerActivityImage.objects.filter(  #get the image name for volunteer activity
                activity_id=activity_id)
            image_urls = []

            for image in images:  # find the image in the s3 server before assigned the url to view the image
                filename = image.filename
                s3 = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                try:
                    presigned_url = s3.generate_presigned_url(
                        'get_object',
                        Params={
                            'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': filename},
                        ExpiresIn=3600
                    )
                    image_urls.append(presigned_url)
                except (BotoCoreError, ClientError):
                    #return success equal to false if something wrong with the s3 server
                    return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})

            activity['image_urls'] = image_urls

        return Response(response_data, status=200)

    def post(self, request):
        serializer = VolunteerActivitySerializer(data=request.data)
        if serializer.is_valid():
            activity = serializer.save()

            images = []
            index = 1
            print(request.FILES)
            while f'image_{index}' in request.FILES:
                image = request.FILES.get(f'image_{index}')
                print(image.name)
                unique_id = str(uuid.uuid4())
                filename = unique_id + '_' + image.name

                s3 = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                try:
                    s3.upload_fileobj(
                        image, settings.AWS_STORAGE_BUCKET_NAME, filename)
                    VolunteerActivityImage.objects.create(
                        activity=activity, filename=filename)
                    images.append(image)
                except (BotoCoreError, ClientError):
                    return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})

                index += 1

            return Response({'success': True, 'message': 'Volunteer activity created successfully'})
        return Response({'success': False, 'error': 'Unable to create volunteer activity. An error occured while creating the volunteer activity'})

    def put(self, request):
        activity_id = request.data.get('id')
        try:
            activity = VolunteerActivity.objects.get(id=activity_id)
        except VolunteerActivity.DoesNotExist:
            return Response({'success': False, 'error': 'Activity not found'})

        serializer = VolunteerActivitySerializer(activity, data=request.data)
        if serializer.is_valid():
            serializer.save()

            images = []
            index = 1
            while f'image_{index}' in request.data:
                image_data = request.data[f'image_{index}']
                image_data = image_data.split(';base64,')[-1]
                image = ContentFile(base64.b64decode(
                    image_data), name='image.jpg')

                unique_id = str(uuid.uuid4())
                filename = unique_id + '_' + image.name

                s3 = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                try:
                    s3.upload_fileobj(
                        image, settings.AWS_STORAGE_BUCKET_NAME, filename)
                    VolunteerActivityImage.objects.create(
                        activity=activity, filename=filename)
                    images.append(image)
                except (BotoCoreError, ClientError):
                    return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})

                index += 1

            return Response({'success': True, 'message': 'Volunteer activity updated successfully'})
        return Response({'success': False, 'error': 'Unable to update volunteer activity. An error occured while update the volunteer activity'})

    def delete(self, request):
        activity_id = request.data.get('id')
        try:
            activity = VolunteerActivity.objects.get(id=activity_id)
        except VolunteerActivity.DoesNotExist:
            return Response({'success': False, 'error': 'Activity not found'})
        images = VolunteerActivityImage.objects.filter(activity_id=activity_id)
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME

        try:
            for image in images:
                # s3.delete_object(Bucket=bucket_name, Key=image.filename)
                image.delete()
        except (BotoCoreError, ClientError):
            return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})

        if VolunteerParticipant.objects.filter(activity_id=activity_id).exists():
            try:
                VolunteerParticipant.objects.filter(
                    activity_id=activity_id).delete()
            except ProtectedError:
                return Response({'success': False, 'error': 'Unable to delete volunteer participants. They are referenced elsewhere'})
        activity.delete()
        return Response({'success': True, 'message': 'Volunteer activity deleted successfully'})


class PictureView(APIView):
    def delete(self, request):
        image_url = request.data.get('imageURL')
        volunteer_id = request.data.get('id')
        image_url = image_url.split("/")[-1].split("?")[0]

        try:
            image = VolunteerActivityImage.objects.get(
                activity_id=volunteer_id, filename=image_url)
        except VolunteerActivityImage.DoesNotExist:
            return Response({'success': False, 'error': 'Image not found'})

        # Delete the image from S3
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        bucket_name = settings.AWS_STORAGE_BUCKET_NAME

        try:
            # s3.delete_object(Bucket=bucket_name, Key=image_url)
            image.delete()
        except (BotoCoreError, ClientError):
            return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})
        return Response({'success': True, 'message': 'Image updated successfully'})


class VolunteerParticipantView(APIView):
    def post(self, request):
        serializer = VolunteerParticipantSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Your Registration is being verified. This may take a while'})
        else:
            print(serializer.errors)
            return Response({'success': False, 'error': 'Unable to registered. Something went wrong in the server'})

    def get(self, request):
        activities = VolunteerActivity.objects.all()
        activity_serializer = VolunteerActivitySerializer(
            activities, many=True)
        response_data = activity_serializer.data

        for activity in response_data:
            activity_id = activity['id']
            participant = []
            participants_count = VolunteerParticipant.objects.filter(
                activity_id=activity_id).count()
            activity['num_participants'] = participants_count
            participant = VolunteerParticipant.objects.filter(
                activity_id=activity_id)
            participant_serializer = getVolunteerParticipantSerializer(
                participant, many=True)
            activity['participant'] = participant_serializer.data

        response_data = [
            activity for activity in response_data if activity['participant']]

        return Response(response_data, status=200)

    def put(self, request,):
        try:
            id = request.data.get('id')
            email = request.data.get('email')
            reason = request.data.get('reason')
            from_email = ['wanluqman@graduate.utm.my']
            subject = 'Volunteer Participant status'
            message = reason
            recipient_list = ['wanluqman@graduate.utm.my']

            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print(f"An error occurred while sending the email: {str(e)}")
            participation_request = get_object_or_404(
                VolunteerParticipant, id=id)
            participation_request.status = request.data.get(
                'status', participation_request.status)
            participation_request.save()
            return Response({'success': True, 'message': 'Participation request updated successfully'})
        except:
            return Response({'success': False, 'error': 'An error occurred while updating Participation request'})

class VolunteerParticipantManage(APIView):
    def get(self, request, param):
        try:
            activity = VolunteerActivity.objects.get(id=param)
            
            participants = VolunteerParticipant.objects.filter(activity=activity)
            participants_serializer = getVolunteerParticipantSerializer(participants, many=True)
            response_data = participants_serializer.data
            return Response(response_data, status=200)
        except VolunteerActivity.DoesNotExist:
            return Response("Activity not found", status=404)

class VolunteerRegisteredView(APIView):
    def get(self, request, param):
        try:
            participant = VolunteerParticipant.objects.filter(user=param)
        except VolunteerParticipant.DoesNotExist:
            return Response({'error': 'Invalid participant ID'}, status=status.HTTP_404_NOT_FOUND)

        activity_ids = participant.values_list('activity_id', flat=True)
        activities = VolunteerActivity.objects.filter(id__in=activity_ids)
        activity_serializer = VolunteerActivitySerializer(
            activities, many=True)
        response_data = []
        for activity in activity_serializer.data:
            activity_id = activity['id']
            participant_entry = participant.get(activity_id=activity_id)
            activity['participant_status'] = participant_entry.status
            images = VolunteerActivityImage.objects.filter(
                activity_id=activity_id)
            image_urls = []
            for image in images:
                filename = image.filename
                s3 = boto3.client(
                    's3',
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
                try:
                    presigned_url = s3.generate_presigned_url(
                        'get_object',
                        Params={
                            'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': filename},
                        ExpiresIn=3600
                    )
                    image_urls.append(presigned_url)
                except (BotoCoreError, ClientError):
                    return Response({'success': False, 'error': 'An Error Occured, Cannot connect to SW3 boston'})

            activity['image_urls'] = image_urls

            response_data.append(activity)

        return Response(response_data, status=200)
