
from django.shortcuts import render

from rest_framework import generics
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from django.template import RequestContext
from django.http import JsonResponse

from api.models import Submission, Language

import logging
import json

logger = logging.getLogger(__name__)


def render_landing_page(request, template="templates/dashboard/home.html"):
    """
    Renders landing page
    """
    logger.debug("Landing page rendered!")
    return render(request, template, context_instance=RequestContext(request))


class SubmissionSerializer(serializers.ModelSerializer):
    """
    Serializer for Submissions
    """
    class Meta:
        model = Submission


class SubmissionView(generics.ListAPIView):
    """
    All submissions related APIs
    """

    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        """
        This view should return a list of all the purchases for
        the user as determined by the username portion of the URL.
        """
        # fetch filters
        status = self.kwargs.get("status", None)
        title = self.kwargs.get("title", None)
        language = self.kwargs.get("language", None)
        
        logger.debug("Filter args: %s" %self.kwargs)
        
        if status is not None:
            logger.debug("Filtering on basis of status: %s" %status)
            return Submission.objects.filter(status__icontains=status)
        elif title is not None:
            logger.debug("Filtering on basis of title: %s" %title)
            return Submission.objects.filter(title__icontains=title)
        elif language is not None:
            logger.debug("Filtering on basis of language: %s" %language)
            return Submission.objects.filter(language__icontains=language)
        else:
            return Submission.objects.all()

    
    @staticmethod
    def get_top_5_submissions():
        """
        Returns list of top 5 submissions 
        """
        languages = Language.objects.all()      
        language_submissions_count = {}; top_5_submissions = []; count = 0;
        for l in languages:
            count = Submission.objects.filter(language=l.language).count()
            language_submissions_count[l.language] = count

        # fetch top 5 language submissions
        i = 0
        for k,v in sorted(language_submissions_count.iteritems(), key=lambda (k,v): (v,k), reverse=True):
            top_5_submissions.append({"language":k, "submissions":v})
            i +=1
            if i>5:
                break

        return top_5_submissions

    @staticmethod
    def get_stats():
        """
        Returns total submissions, top 2 attempts and submissions per level
        """

        # top 2 attempted
        top_2_attempts = {
            "first": {
                "attempts": 0,
                "question" : "",
            },
            "second": {
                "attempts" : 0,
                "question": "",
            },
        }       
        total_submissions = 0
        submissions_per_level = {
            "easy": 0,
            "medium": 0,
            "hard": 0,
        }

        submissions = Submission.objects.all()
        total_submissions = submissions.count()
        for sub in submissions:

            metadata = json.loads(sub.metadata)
            attempts = metadata["users_attempted"]

            # update total submissions
            #total_submissions += metadata["users_attempted"]

            # update submissions per levels
            submissions_per_level[metadata["level"].lower()] += 1

            # update distinct top 2 attempts
            if (attempts > top_2_attempts["first"]["attempts"]):
                if not (top_2_attempts["second"]["question"] == top_2_attempts["first"]["question"]):
                    top_2_attempts["second"]["attempts"] = top_2_attempts["first"]["attempts"]
                    top_2_attempts["second"]["question"] = top_2_attempts["first"]["question"]
                if not (top_2_attempts["first"]["question"] == sub.title):
                    top_2_attempts["first"]["attempts"] = attempts
                    top_2_attempts["first"]["question"] = sub.title             

            elif (attempts > top_2_attempts["second"]["attempts"]):
                if not (top_2_attempts["second"]["question"] == sub.title):
                    top_2_attempts["second"]["attempts"] = attempts
                    top_2_attempts["second"]["question"] = sub.title

        return (top_2_attempts, total_submissions, submissions_per_level)


    # statistical analysis API
    def stats(self, request):
        response = {}   
        try:    
            response["top_5_submissions"] = SubmissionView.get_top_5_submissions()
        except Exception as e:
            logger.exception(e)

        try:
            (response["top_2_attempts"], response["total_submissions"], response["submisisons_per_level"]) = SubmissionView.get_stats()            
        except Exception as e:
            logger.exception(e)            

        return JsonResponse(response, status=200, safe=False)



