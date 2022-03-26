from rest_framework.permissions import BasePermission


class ChatRoomOwnerPermission(BasePermission):
    def has_permission(self, request, view):
        return view.access_token.chat_room.owner_id == view.access_token.participant_id
