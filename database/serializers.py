from rest_framework import serializers

class MovieGetSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    title = serializers.CharField(required=True, allow_blank=False)
    year = serializers.CharField(required=True, allow_blank=False)
    genre = serializers.CharField(required=True, allow_blank=False)


class MovieCreateSerializer(serializers.Serializer):
    title = serializers.CharField(required=True, allow_blank=False)
    year = serializers.CharField(required=True, allow_blank=False)
    genre = serializers.CharField(required=True, allow_blank=False)


class MovieEditSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    title = serializers.CharField(required=True, allow_blank=False)
    year = serializers.CharField(required=True, allow_blank=False)
    genre = serializers.CharField(required=True, allow_blank=False)


class MovieDeleteSerializer(serializers.Serializer):
    uid = serializers.IntegerField()